
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookResponse = (sessionId: string | null) => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'polling'>('initial');

  useEffect(() => {
    if (!sessionId) {
      console.log('❌ useWebhookResponse - No sessionId provided');
      setIsLoading(false);
      setError('Session ID não fornecido');
      return;
    }

    console.log('🔍 useWebhookResponse - Starting loading phases for sessionId:', sessionId);
    
    let pollCount = 0;
    const maxPolls = 13; // 40 segundos ÷ 3 segundos (aproximadamente)
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
          console.log('✅ useWebhookResponse - Found response for session:', response);
          setResponse(response.content);
          setIsLoading(false);
          
          // Parar o polling
          if (intervalId) {
            clearInterval(intervalId);
          }
          return;
        }

        if (pollCount >= maxPolls) {
          console.log('⏰ useWebhookResponse - Timeout reached for session:', sessionId);
          setError('Timeout: Não conseguimos gerar sua resposta. Tente novamente.');
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

    // Fase 1: Carregamento inicial de 15 segundos
    console.log('⏳ useWebhookResponse - Starting initial 15s loading phase');
    setLoadingPhase('initial');
    
    initialTimeout = setTimeout(() => {
      console.log('🔄 useWebhookResponse - Switching to polling phase');
      setLoadingPhase('polling');
      
      // Fazer primeira busca imediatamente
      pollForResponse();
      
      // Continuar polling a cada 2 segundos
      intervalId = setInterval(pollForResponse, 2000);
    }, 15000); // 15 segundos

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
