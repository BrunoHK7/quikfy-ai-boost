
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookResponse = (sessionId: string | null) => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'polling'>('initial');

  useEffect(() => {
    // Só iniciar se temos um sessionId válido
    if (!sessionId) {
      console.log('❌ useWebhookResponse - No sessionId provided, waiting...');
      setIsLoading(false);
      setError(null);
      return;
    }

    console.log('🔍 useWebhookResponse - Starting loading phases for sessionId:', sessionId);
    setIsLoading(true);
    setError(null);
    setResponse(null); // Reset response
    
    let pollCount = 0;
    const maxPolls = 20; // Aumentar tentativas para 60 segundos
    let intervalId: NodeJS.Timeout;
    let initialTimeout: NodeJS.Timeout;
    
    const pollForResponse = async () => {
      try {
        pollCount++;
        console.log(`🔄 useWebhookResponse - Poll ${pollCount}/${maxPolls} for session ${sessionId}`);
        
        // Buscar resposta específica para este sessionId
        const { data, error: queryError } = await supabase
          .from('webhook_responses')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (queryError) {
          console.error('❌ useWebhookResponse - Query error:', queryError);
          setError('Erro ao consultar respostas: ' + queryError.message);
          setIsLoading(false);
          return;
        }
        
        console.log(`📊 useWebhookResponse - Query result for ${sessionId}:`, data);
        
        if (data && data.length > 0) {
          const response = data[0];
          console.log('✅ useWebhookResponse - Found response for sessionId:', sessionId);
          console.log('📄 Response content preview:', response.content.substring(0, 100));
          
          // Verificar se é uma resposta de processamento ou resposta real
          try {
            const parsedContent = JSON.parse(response.content);
            if (parsedContent.status === 'processing') {
              console.log('⏳ Response still processing, continue polling...');
              // Continuar polling
            } else {
              // Resposta real encontrada
              setResponse(response.content);
              setIsLoading(false);
              
              // Parar o polling
              if (intervalId) {
                clearInterval(intervalId);
              }
              return;
            }
          } catch (e) {
            // Se não é JSON ou não tem status processing, assumir que é resposta real
            setResponse(response.content);
            setIsLoading(false);
            
            // Parar o polling
            if (intervalId) {
              clearInterval(intervalId);
            }
            return;
          }
        }

        if (pollCount >= maxPolls) {
          console.log('⏰ useWebhookResponse - Timeout reached for session:', sessionId);
          setError('Timeout: Não conseguimos gerar sua resposta a tempo. Tente novamente.');
          setIsLoading(false);
          
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

    // Fase 1: Carregamento inicial de 10 segundos
    console.log('⏳ useWebhookResponse - Starting initial 10s loading phase');
    setLoadingPhase('initial');
    
    initialTimeout = setTimeout(() => {
      console.log('🔄 useWebhookResponse - Switching to polling phase');
      setLoadingPhase('polling');
      
      // Fazer primeira busca imediatamente
      pollForResponse();
      
      // Continuar polling a cada 3 segundos
      intervalId = setInterval(pollForResponse, 3000);
    }, 10000); // 10 segundos

    // Cleanup
    return () => {
      console.log('🧹 useWebhookResponse - Cleanup for session:', sessionId);
      if (initialTimeout) {
        clearTimeout(initialTimeout);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [sessionId]);

  return { response, isLoading, error, loadingPhase };
};
