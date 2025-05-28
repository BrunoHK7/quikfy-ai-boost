
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
    console.log('Webhook received:', req.method)
    
    if (req.method === 'POST') {
      const body = await req.text()
      console.log('Webhook body received:', body)
      
      let parsedData
      try {
        parsedData = JSON.parse(body)
        console.log('Parsed JSON data:', parsedData)
      } catch (parseError) {
        console.log('Failed to parse as JSON, treating as plain text:', parseError)
        parsedData = { content: body }
      }
      
      // Extract the actual response content
      let responseContent = ''
      if (parsedData.resposta) {
        responseContent = parsedData.resposta
      } else if (parsedData.content) {
        responseContent = parsedData.content
      } else if (typeof parsedData === 'string') {
        responseContent = parsedData
      } else {
        responseContent = JSON.stringify(parsedData)
      }
      
      console.log('Extracted response content:', responseContent)
      
      // Extract session ID - priorize sessionId over session_id
      let sessionId = parsedData.sessionId || parsedData.session_id
      
      if (!sessionId) {
        // Try to extract from URL parameters if present
        const url = new URL(req.url)
        sessionId = url.searchParams.get('sessionId') || url.searchParams.get('session_id')
      }
      
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('Generated new session ID:', sessionId)
      } else {
        console.log('Using provided session ID:', sessionId)
      }
      
      // Store in webhook_responses table with session_id
      const { error: insertError } = await supabase
        .from('webhook_responses')
        .insert({
          session_id: sessionId,
          content: responseContent,
          created_at: new Date().toISOString()
        })
      
      if (insertError) {
        console.error('Error storing webhook response:', insertError)
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
      } else {
        console.log('Webhook response stored with session:', sessionId)
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Webhook received successfully',
          session_id: sessionId,
          content: responseContent
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
    console.error('Webhook error:', error)
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
