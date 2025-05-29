
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
        
        // BUSCAR sessionId em TODAS as possibilidades
        // 1. Primeiro no root como sessionId
        if (parsedData.sessionId) {
          sessionId = parsedData.sessionId
          console.log('✅ Found sessionId in root:', sessionId)
        }
        // 2. Como session_id no root
        else if (parsedData.session_id) {
          sessionId = parsedData.session_id
          console.log('✅ Found session_id in root:', sessionId)
        }
        // 3. Dentro de objeto session
        else if (parsedData.session && parsedData.session.sessionId) {
          sessionId = parsedData.session.sessionId
          console.log('✅ Found sessionId in session object:', sessionId)
        }
        // 4. Buscar recursivamente em todos os campos
        else {
          console.log('🔍 Searching for sessionId recursively...')
          const findSessionId = (obj, path = '') => {
            if (!obj || typeof obj !== 'object') return null
            
            for (const [key, value] of Object.entries(obj)) {
              const currentPath = path ? `${path}.${key}` : key
              console.log(`Checking ${currentPath}:`, value)
              
              if ((key === 'sessionId' || key === 'session_id') && typeof value === 'string') {
                console.log(`✅ Found sessionId at ${currentPath}:`, value)
                return value
              }
              
              if (typeof value === 'object' && value !== null) {
                const found = findSessionId(value, currentPath)
                if (found) return found
              }
            }
            return null
          }
          
          sessionId = findSessionId(parsedData)
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
        } else {
          console.log('Using entire JSON as content')
          responseContent = body
        }
        
      } catch (parseError) {
        console.log('❌ Not JSON, using raw text as content')
        responseContent = body
      }
      
      // CRITICAL: Se não encontrou sessionId, NÃO SALVAR com fallback
      if (!sessionId) {
        console.error('❌ CRITICAL: No sessionId found in payload!')
        console.error('Full payload for debugging:', body)
        return new Response(
          JSON.stringify({ 
            error: 'No sessionId found in payload', 
            received_data: body.substring(0, 500) + '...' 
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
