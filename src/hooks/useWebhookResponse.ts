
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookResponse = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem('carouselSessionId');
    console.log('useWebhookResponse - Session ID from localStorage:', sessionId);
    
    if (!sessionId) {
      console.log('useWebhookResponse - No session found');
      setError('No session found');
      setIsLoading(false);
      return;
    }

    let pollCount = 0;
    const maxPolls = 60; // Aumentando para 2 minutos
    
    const pollForResponse = async () => {
      try {
        console.log(`useWebhookResponse - Polling attempt ${pollCount + 1}/${maxPolls} for session: ${sessionId}`);
        
        // Query mais específica e detalhada
        const { data, error: queryError } = await supabase
          .from('webhook_responses')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (queryError) {
          console.error('useWebhookResponse - Query error:', queryError);
          setError('Erro ao consultar respostas do webhook: ' + queryError.message);
          setIsLoading(false);
          return;
        }
        
        console.log('useWebhookResponse - Query result for session', sessionId, ':', data);
        
        if (data && data.length > 0) {
          console.log('useWebhookResponse - Found webhook response:', data[0]);
          setResponse(data[0].content);
          setIsLoading(false);
          localStorage.removeItem('carouselSessionId'); // Limpar apenas após sucesso
          return;
        }

        pollCount++;
        if (pollCount >= maxPolls) {
          console.log('useWebhookResponse - Timeout reached after', maxPolls, 'attempts');
          setError('Timeout: Não recebemos resposta do webhook após 2 minutos');
          setIsLoading(false);
          localStorage.removeItem('carouselSessionId');
          return;
        }

        // Polling a cada 2 segundos
        setTimeout(pollForResponse, 2000);
        
      } catch (err) {
        console.error('useWebhookResponse - Polling error:', err);
        setError('Erro ao verificar resposta: ' + (err as Error).message);
        setIsLoading(false);
      }
    };

    // Começar polling imediatamente
    pollForResponse();

    // Cleanup
    return () => {
      console.log('useWebhookResponse - Cleanup for session:', sessionId);
    };
  }, []);

  return { response, isLoading, error };
};
