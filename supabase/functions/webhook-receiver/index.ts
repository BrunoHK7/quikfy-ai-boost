
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
      let responseContent = ''
      let sessionId = null
      
      // Parse JSON
      try {
        parsedData = JSON.parse(body)
        console.log('Parsed JSON successfully:', parsedData)
      } catch (parseError) {
        console.log('Failed to parse JSON, using as text:', parseError)
        responseContent = body
        sessionId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      
      if (parsedData) {
        // Extract content
        if (parsedData.resposta) {
          responseContent = parsedData.resposta
          console.log('Using resposta field')
        } else if (parsedData.content) {
          responseContent = parsedData.content
          console.log('Using content field')
        } else if (typeof parsedData === 'string') {
          responseContent = parsedData
          console.log('Using raw string')
        } else {
          responseContent = JSON.stringify(parsedData)
          console.log('Converting object to string')
        }
        
        // Extract session ID - try multiple approaches
        sessionId = parsedData.sessionId || 
                   parsedData.session_id || 
                   parsedData.SessionId ||
                   parsedData.SESSION_ID ||
                   new URL(req.url).searchParams.get('sessionId') ||
                   new URL(req.url).searchParams.get('session_id')
        
        if (!sessionId) {
          sessionId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          console.log('Generated new sessionId:', sessionId)
        } else {
          console.log('Found sessionId:', sessionId)
        }
      }
      
      console.log('Final sessionId:', sessionId)
      console.log('Final content length:', responseContent.length)
      console.log('Content preview:', responseContent.substring(0, 100))
      
      // Always insert new record (don't check for existing)
      const { data: insertData, error: insertError } = await supabase
        .from('webhook_responses')
        .insert({
          session_id: sessionId,
          content: responseContent,
          created_at: new Date().toISOString()
        })
        .select()
      
      if (insertError) {
        console.error('Insert error:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to store response', details: insertError.message }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      console.log('Successfully inserted:', insertData)
      
      // Verify the data was saved
      const { data: verifyData, error: verifyError } = await supabase
        .from('webhook_responses')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1)
      
      console.log('Verification query result:', verifyData)
      if (verifyError) {
        console.error('Verification error:', verifyError)
      }
      
      console.log('=== WEBHOOK RECEIVER SUCCESS ===')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Webhook processed successfully',
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
