
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
      
      let parsedData
      try {
        parsedData = JSON.parse(body)
        console.log('Parsed JSON data:', JSON.stringify(parsedData, null, 2))
      } catch (parseError) {
        console.log('Failed to parse as JSON, treating as plain text:', parseError)
        parsedData = { content: body }
      }
      
      // Extrair o conteúdo da resposta
      let responseContent = ''
      if (parsedData.resposta) {
        responseContent = parsedData.resposta
        console.log('Found "resposta" field')
      } else if (parsedData.content) {
        responseContent = parsedData.content
        console.log('Found "content" field')
      } else if (typeof parsedData === 'string') {
        responseContent = parsedData
        console.log('Using raw string data')
      } else {
        responseContent = JSON.stringify(parsedData)
        console.log('Converting entire object to string')
      }
      
      console.log('Final response content (first 200 chars):', responseContent.substring(0, 200) + '...')
      
      // Extrair session ID - múltiplas tentativas
      let sessionId = null
      
      // 1. Tentar parsedData.sessionId
      if (parsedData.sessionId) {
        sessionId = parsedData.sessionId
        console.log('Found sessionId in parsedData.sessionId:', sessionId)
      }
      
      // 2. Tentar parsedData.session_id
      if (!sessionId && parsedData.session_id) {
        sessionId = parsedData.session_id
        console.log('Found sessionId in parsedData.session_id:', sessionId)
      }
      
      // 3. Tentar URL parameters
      if (!sessionId) {
        const url = new URL(req.url)
        sessionId = url.searchParams.get('sessionId') || url.searchParams.get('session_id')
        if (sessionId) {
          console.log('Found sessionId in URL params:', sessionId)
        }
      }
      
      // 4. Gerar novo sessionId se nenhum foi encontrado
      if (!sessionId) {
        sessionId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('Generated new sessionId:', sessionId)
      }
      
      console.log('Final sessionId to be used:', sessionId)
      
      // Verificar se já existe uma resposta para esta sessão
      const { data: existingData } = await supabase
        .from('webhook_responses')
        .select('id')
        .eq('session_id', sessionId)
        .limit(1)
      
      if (existingData && existingData.length > 0) {
        console.log('Session already exists, updating existing record')
        
        const { error: updateError } = await supabase
          .from('webhook_responses')
          .update({
            content: responseContent,
            created_at: new Date().toISOString()
          })
          .eq('session_id', sessionId)
        
        if (updateError) {
          console.error('Error updating webhook response:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to update response', details: updateError.message }),
            { 
              status: 500,
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              } 
            }
          )
        }
        
        console.log('Successfully updated webhook response for session:', sessionId)
      } else {
        console.log('Creating new webhook response record')
        
        // Inserir nova resposta
        const { error: insertError } = await supabase
          .from('webhook_responses')
          .insert({
            session_id: sessionId,
            content: responseContent,
            created_at: new Date().toISOString()
          })
        
        if (insertError) {
          console.error('Error inserting webhook response:', insertError)
          return new Response(
            JSON.stringify({ error: 'Failed to store response', details: insertError.message }),
            { 
              status: 500,
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              } 
            }
          )
        }
        
        console.log('Successfully inserted webhook response for session:', sessionId)
      }
      
      // Verificar se foi salvo corretamente
      const { data: verifyData, error: verifyError } = await supabase
        .from('webhook_responses')
        .select('*')
        .eq('session_id', sessionId)
        .limit(1)
      
      if (verifyError) {
        console.error('Error verifying saved data:', verifyError)
      } else {
        console.log('Verification - saved data:', verifyData)
      }
      
      console.log('=== WEBHOOK RECEIVER SUCCESS ===')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Webhook received and processed successfully',
          session_id: sessionId,
          content_length: responseContent.length
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('=== WEBHOOK RECEIVER ERROR ===')
    console.error('Error details:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
