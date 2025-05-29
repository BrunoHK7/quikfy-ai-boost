
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
    
    if (req.method === 'POST') {
      const body = await req.text()
      console.log('Raw webhook body:', body)
      
      let sessionId = null
      let responseContent = body
      
      // Tentar extrair sessionId e conteúdo do JSON
      try {
        const parsedData = JSON.parse(body)
        console.log('Parsed JSON data:', parsedData)
        
        // Busca mais completa pelo sessionId
        // 1. Primeiro nivel - sessionId
        if (parsedData.sessionId && typeof parsedData.sessionId === 'string') {
          sessionId = parsedData.sessionId
          console.log('✅ Found sessionId at root level:', sessionId)
        }
        // 2. Primeiro nivel - session_id  
        else if (parsedData.session_id && typeof parsedData.session_id === 'string') {
          sessionId = parsedData.session_id
          console.log('✅ Found session_id at root level:', sessionId)
        }
        // 3. Dentro de um objeto data ou payload
        else if (parsedData.data) {
          if (parsedData.data.sessionId) {
            sessionId = parsedData.data.sessionId
            console.log('✅ Found sessionId in data object:', sessionId)
          } else if (parsedData.data.session_id) {
            sessionId = parsedData.data.session_id
            console.log('✅ Found session_id in data object:', sessionId)
          }
        }
        // 4. Busca em todos os campos de primeiro nivel
        else {
          console.log('🔍 Searching all top-level fields for sessionId...')
          for (const [key, value] of Object.entries(parsedData)) {
            console.log(`Checking field "${key}":`, value)
            if (typeof value === 'string' && (key.toLowerCase().includes('session') || value.includes('quiz_session_'))) {
              sessionId = value
              console.log(`✅ Found sessionId in field "${key}":`, sessionId)
              break
            }
            // Se o valor é um objeto, verificar dentro dele
            if (typeof value === 'object' && value !== null) {
              const obj = value as Record<string, any>
              if (obj.sessionId) {
                sessionId = obj.sessionId
                console.log(`✅ Found sessionId in nested object "${key}":`, sessionId)
                break
              }
              if (obj.session_id) {
                sessionId = obj.session_id
                console.log(`✅ Found session_id in nested object "${key}":`, sessionId)
                break
              }
            }
          }
        }
        
        // Extrair o conteúdo da resposta
        if (parsedData.resposta) {
          responseContent = parsedData.resposta
          console.log('Using resposta field as content')
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
        } else {
          console.log('Using entire JSON as content')
          responseContent = body
        }
        
      } catch (parseError) {
        console.log('❌ Not JSON, using raw text as content')
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
            help: 'Make sure the sessionId is being sent in the payload' 
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      console.log('🎯 FINAL sessionId to save:', sessionId)
      console.log('📝 Final content:', responseContent.substring(0, 200) + '...')
      console.log('📏 Content length:', responseContent.length)
      
      // Salvar APENAS com o sessionId encontrado
      const { data: insertData, error: insertError } = await supabase
        .from('webhook_responses')
        .insert({
          session_id: sessionId,
          content: responseContent,
          created_at: new Date().toISOString()
        })
        .select()
      
      if (insertError) {
        console.error('❌ Insert error:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to store response', details: insertError.message }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      console.log('✅ Successfully inserted:', insertData)
      console.log('=== WEBHOOK RECEIVER SUCCESS ===')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Response saved successfully',
          session_id: sessionId,
          content_length: responseContent.length,
          inserted_id: insertData?.[0]?.id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
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
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
