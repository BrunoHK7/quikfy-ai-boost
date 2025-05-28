
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookResponse = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem('carouselSessionId');
    if (!sessionId) {
      setError('No session found');
      setIsLoading(false);
      return;
    }

    let pollCount = 0;
    const maxPolls = 60; // 60 polls = 2 minutes
    
    const pollForResponse = async () => {
      try {
        console.log(`Polling for webhook response for session ${sessionId}, attempt ${pollCount + 1}`);
        
        // Query the webhook_responses table specifically for this session
        const { data, error: queryError } = await supabase
          .from('webhook_responses')
          .select('content')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (queryError) {
          console.error('Error querying webhook responses:', queryError);
        } else if (data && data.length > 0) {
          console.log('Found webhook response for session:', sessionId, data[0].content);
          setResponse(data[0].content);
          setIsLoading(false);
          localStorage.removeItem('carouselSessionId');
          return;
        }

        pollCount++;
        if (pollCount >= maxPolls) {
          setError('Timeout: Não recebemos resposta do webhook após 2 minutos');
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

    // Start polling after a short delay
    setTimeout(pollForResponse, 1000);

    // Cleanup on unmount
    return () => {
      localStorage.removeItem('carouselSessionId');
    };
  }, []);

  return { response, isLoading, error };
};
