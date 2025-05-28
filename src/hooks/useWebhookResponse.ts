
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookResponse = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem('carouselSessionId');
    console.log('🔍 useWebhookResponse - Session ID from localStorage:', sessionId);
    
    if (!sessionId) {
      console.log('❌ useWebhookResponse - No session found');
      setError('No session found');
      setIsLoading(false);
      return;
    }

    let pollCount = 0;
    const maxPolls = 90; // 3 minutos
    let intervalId: NodeJS.Timeout;
    
    const pollForResponse = async () => {
      try {
        pollCount++;
        console.log(`🔄 useWebhookResponse - Poll ${pollCount}/${maxPolls} for session: ${sessionId}`);
        
        // Query mais específica
        const { data, error: queryError } = await supabase
          .from('webhook_responses')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(5); // Buscar múltiplos para debug
        
        if (queryError) {
          console.error('❌ useWebhookResponse - Query error:', queryError);
          setError('Erro ao consultar respostas: ' + queryError.message);
          setIsLoading(false);
          return;
        }
        
        console.log(`📊 useWebhookResponse - Query result:`, data);
        console.log(`📊 useWebhookResponse - Found ${data?.length || 0} records`);
        
        if (data && data.length > 0) {
          const latestResponse = data[0];
          console.log('✅ useWebhookResponse - Found response:', latestResponse);
          setResponse(latestResponse.content);
          setIsLoading(false);
          
          // Limpar session apenas após sucesso
          localStorage.removeItem('carouselSessionId');
          
          // Parar o polling
          if (intervalId) {
            clearInterval(intervalId);
          }
          return;
        }

        if (pollCount >= maxPolls) {
          console.log('⏰ useWebhookResponse - Timeout reached');
          setError('Timeout: Não recebemos resposta após 3 minutos');
          setIsLoading(false);
          localStorage.removeItem('carouselSessionId');
          
          if (intervalId) {
            clearInterval(intervalId);
          }
          return;
        }
        
      } catch (err) {
        console.error('❌ useWebhookResponse - Polling error:', err);
        setError('Erro ao verificar resposta: ' + (err as Error).message);
        setIsLoading(false);
        
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    // Fazer primeira busca imediatamente
    pollForResponse();
    
    // Continuar polling a cada 2 segundos
    intervalId = setInterval(pollForResponse, 2000);

    // Cleanup
    return () => {
      console.log('🧹 useWebhookResponse - Cleanup for session:', sessionId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return { response, isLoading, error };
};
