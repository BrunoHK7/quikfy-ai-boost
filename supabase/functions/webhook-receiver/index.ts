
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== WEBHOOK RECEIVER START ===')
    console.log('Method:', req.method)
    console.log('URL:', req.url)
    console.log('Headers:', Object.fromEntries(req.headers.entries()))
    
    if (req.method === 'POST') {
      const body = await req.text()
      console.log('Raw webhook body:', body)
      
      let sessionId = null
      let responseContent = body
      let isDirectFrontendCall = false
      
      // Tentar extrair sessionId e conteúdo do JSON
      try {
        const parsedData = JSON.parse(body)
        console.log('Parsed JSON data:', parsedData)
        
        // Detectar se é uma chamada DIRETA do frontend (tem campo 'topic' mas não tem 'resposta')
        if (parsedData.topic && !parsedData.resposta && !parsedData.content && !parsedData.text && !parsedData.response) {
          console.log('🔧 Direct frontend call detected')
          isDirectFrontendCall = true
          
          // Extrair sessionId
          if (parsedData.sessionId) {
            sessionId = parsedData.sessionId
            console.log('✅ Found sessionId in frontend call:', sessionId)
          }
          
          if (sessionId) {
            // Inserir resposta placeholder que será substituída pelo Make
            const { data: insertData, error: insertError } = await supabase
              .from('webhook_responses')
              .insert({
                session_id: sessionId,
                content: JSON.stringify({
                  status: "processing",
                  message: "Carrossel sendo gerado..."
                }),
                created_at: new Date().toISOString()
              })
              .select()
            
            if (insertError) {
              console.error('❌ Insert error:', insertError)
              return new Response(
                JSON.stringify({ error: 'Failed to create placeholder', details: insertError.message }),
                { 
                  status: 500,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                }
              )
            } else {
              console.log('✅ Placeholder response inserted:', insertData)
            }
            
            return new Response(
              JSON.stringify({ 
                success: true, 
                session_id: sessionId,
                message: 'Request received, processing...'
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          } else {
            console.error('❌ No sessionId found in frontend call')
            return new Response(
              JSON.stringify({ error: 'No sessionId found in frontend call' }),
              { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
        }
        
        // Para dados vindos do Make (contém resposta real)
        console.log('🎯 Processing Make webhook data')
        
        // Extrair sessionId - múltiplas tentativas
        if (parsedData.sessionId && typeof parsedData.sessionId === 'string') {
          sessionId = parsedData.sessionId
          console.log('✅ Found sessionId at root level:', sessionId)
        }
        else if (parsedData.session_id && typeof parsedData.session_id === 'string') {
          sessionId = parsedData.session_id
          console.log('✅ Found session_id at root level:', sessionId)
        }
        // Busca em objetos aninhados
        else if (parsedData.data) {
          if (parsedData.data.sessionId) {
            sessionId = parsedData.data.sessionId
            console.log('✅ Found sessionId in data object:', sessionId)
          } else if (parsedData.data.session_id) {
            sessionId = parsedData.data.session_id
            console.log('✅ Found session_id in data object:', sessionId)
          }
        }
        
        // Extrair o conteúdo da resposta do Make
        if (parsedData.resposta) {
          responseContent = parsedData.resposta
          console.log('Using resposta field as content')
        } else if (parsedData.response) {
          responseContent = parsedData.response
          console.log('Using response field as content')
        } else if (parsedData.content) {
          responseContent = parsedData.content
          console.log('Using content field as content')
        } else if (parsedData.text) {
          responseContent = parsedData.text
          console.log('Using text field as content')
        } else if (parsedData.value) {
          responseContent = parsedData.value
          console.log('Using value field as content')
        } else if (parsedData.data && parsedData.data.resposta) {
          responseContent = parsedData.data.resposta
          console.log('Using data.resposta field as content')
        } else if (parsedData.data && parsedData.data.response) {
          responseContent = parsedData.data.response
          console.log('Using data.response field as content')
        } else {
          console.log('Using entire JSON as content')
          responseContent = body
        }
        
      } catch (parseError) {
        console.log('❌ Not JSON, using raw text as content')
        console.log('Parse error:', parseError)
        responseContent = body
      }
      
      // Se AINDA não temos sessionId, TENTAR extrair do texto bruto
      if (!sessionId) {
        console.log('🔍 Last attempt: searching for sessionId in raw text...')
        const sessionMatch = body.match(/quiz_session_\d+_[a-z0-9]+/i)
        if (sessionMatch) {
          sessionId = sessionMatch[0]
          console.log('✅ Found sessionId in raw text:', sessionId)
        }
      }
      
      // CRITICAL: Se não encontrou sessionId, RETORNAR ERRO
      if (!sessionId) {
        console.error('❌ CRITICAL: No sessionId found anywhere in payload!')
        console.error('Full payload for debugging:', body)
        return new Response(
          JSON.stringify({ 
            error: 'No sessionId found in payload', 
            received_data: body.substring(0, 500) + '...',
            help: 'Make sure the sessionId is being sent in the payload',
            expected_formats: [
              '{ "sessionId": "quiz_session_xxx", "resposta": "..." }',
              '{ "session_id": "quiz_session_xxx", "response": "..." }',
              '{ "data": { "sessionId": "quiz_session_xxx", "resposta": "..." } }'
            ]
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      console.log('🎯 FINAL sessionId to save:', sessionId)
      console.log('📝 Final content preview:', typeof responseContent === 'string' ? responseContent.substring(0, 200) + '...' : JSON.stringify(responseContent).substring(0, 200) + '...')
      console.log('📏 Content length:', typeof responseContent === 'string' ? responseContent.length : JSON.stringify(responseContent).length)
      console.log('🔄 Is direct frontend call:', isDirectFrontendCall)
      
      // Para chamadas do Make (resposta real), fazer UPSERT para substituir placeholder
      if (!isDirectFrontendCall) {
        // Garantir que responseContent seja string
        const finalContent = typeof responseContent === 'string' ? responseContent : JSON.stringify(responseContent)
        
        const { data: upsertData, error: upsertError } = await supabase
          .from('webhook_responses')
          .upsert({
            session_id: sessionId,
            content: finalContent,
            created_at: new Date().toISOString()
          }, {
            onConflict: 'session_id'
          })
          .select()
        
        if (upsertError) {
          console.error('❌ Upsert error:', upsertError)
          return new Response(
            JSON.stringify({ error: 'Failed to store response', details: upsertError.message }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
        console.log('✅ Successfully upserted:', upsertData)
        console.log('=== WEBHOOK RECEIVER SUCCESS ===')
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Response saved successfully',
            session_id: sessionId,
            content_length: finalContent.length,
            upserted_id: upsertData?.[0]?.id
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('=== WEBHOOK RECEIVER ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
