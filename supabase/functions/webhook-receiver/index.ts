
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
        
        // BUSCAR sessionId - Make envia com sessionId no root
        if (parsedData.sessionId) {
          sessionId = parsedData.sessionId
          console.log('✅ Found sessionId from Make:', sessionId)
        }
        // Backup: session_id
        else if (parsedData.session_id) {
          sessionId = parsedData.session_id
          console.log('✅ Found session_id:', sessionId)
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
      
      // Se AINDA não temos sessionId do Make, usar fallback mas com warning
      if (!sessionId) {
        console.warn('⚠️ WARNING: No sessionId found from Make, generating fallback')
        sessionId = `response_${Date.now()}`
        console.log('Generated fallback sessionId:', sessionId)
      }
      
      console.log('🎯 FINAL sessionId to save:', sessionId)
      console.log('📝 Final content:', responseContent.substring(0, 200) + '...')
      console.log('📏 Content length:', responseContent.length)
      
      // Salvar com o sessionId (do Make ou fallback)
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
