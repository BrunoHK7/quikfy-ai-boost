
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
    const maxPolls = 30; // 30 polls = 60 seconds
    
    const pollForResponse = async () => {
      try {
        // Check localStorage first
        const localResponse = localStorage.getItem('webhookResponse');
        if (localResponse) {
          setResponse(localResponse);
          setIsLoading(false);
          localStorage.removeItem('webhookResponse');
          localStorage.removeItem('carouselSessionId');
          return;
        }

        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const responseParam = urlParams.get('response');
        if (responseParam) {
          try {
            const decodedResponse = decodeURIComponent(responseParam);
            setResponse(decodedResponse);
            setIsLoading(false);
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
            localStorage.removeItem('carouselSessionId');
            return;
          } catch (err) {
            console.error('Error decoding URL response:', err);
          }
        }

        pollCount++;
        if (pollCount >= maxPolls) {
          setError('Timeout: Não recebemos resposta do webhook');
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

    // Start polling
    pollForResponse();

    // Cleanup on unmount
    return () => {
      localStorage.removeItem('carouselSessionId');
    };
  }, []);

  return { response, isLoading, error };
};
