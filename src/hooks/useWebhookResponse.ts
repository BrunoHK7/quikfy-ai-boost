
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookResponse = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem('carouselSessionId');
    console.log('Session ID from localStorage:', sessionId);
    
    if (!sessionId) {
      setError('No session found');
      setIsLoading(false);
      return;
    }

    let pollCount = 0;
    const maxPolls = 30; // Reduzindo para 1 minuto (30 polls)
    
    const pollForResponse = async () => {
      try {
        console.log(`Polling for webhook response for session ${sessionId}, attempt ${pollCount + 1}`);
        
        // Query the webhook_responses table specifically for this session
        const { data, error: queryError } = await supabase
          .from('webhook_responses')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (queryError) {
          console.error('Error querying webhook responses:', queryError);
          setError('Erro ao consultar respostas do webhook');
          setIsLoading(false);
          return;
        }
        
        console.log('Query result:', data);
        
        if (data && data.length > 0) {
          console.log('Found webhook response for session:', sessionId, data[0].content);
          setResponse(data[0].content);
          setIsLoading(false);
          localStorage.removeItem('carouselSessionId');
          return;
        }

        pollCount++;
        if (pollCount >= maxPolls) {
          setError('Timeout: Não recebemos resposta do webhook após 1 minuto');
          setIsLoading(false);
          localStorage.removeItem('carouselSessionId');
          return;
        }

        // Poll again in 2 seconds
        setTimeout(pollForResponse, 2000);
        
      } catch (err) {
        console.error('Error polling for response:', err);
        setError('Erro ao verificar resposta');
        setIsLoading(false);
      }
    };

    // Start polling immediately
    pollForResponse();

    // Cleanup on unmount
    return () => {
      // Don't remove session on cleanup, only on success or timeout
    };
  }, []);

  return { response, isLoading, error };
};
