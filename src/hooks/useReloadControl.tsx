
import { useEffect, useRef } from 'react';

interface ReloadControlOptions {
  maxIntervalMinutes?: number;
  enableAutoReload?: boolean;
}

export const useReloadControl = (options: ReloadControlOptions = {}) => {
  const { maxIntervalMinutes = 3, enableAutoReload = true } = options;
  const lastReloadTimeRef = useRef<number>(Date.now());
  const autoReloadTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para verificar se pode recarregar
  const canReload = (): boolean => {
    const now = Date.now();
    const timeSinceLastReload = now - lastReloadTimeRef.current;
    const threeMinutesInMs = maxIntervalMinutes * 60 * 1000;
    
    return timeSinceLastReload >= threeMinutesInMs;
  };

  // Função para recarregar manualmente
  const manualReload = () => {
    console.log('🔄 Manual reload triggered');
    lastReloadTimeRef.current = Date.now();
    window.location.reload();
  };

  // Configurar timer automático de 3 minutos
  const setupAutoReload = () => {
    if (!enableAutoReload) return;

    if (autoReloadTimerRef.current) {
      clearTimeout(autoReloadTimerRef.current);
    }

    autoReloadTimerRef.current = setTimeout(() => {
      console.log('⏰ Auto reload after 3 minutes');
      lastReloadTimeRef.current = Date.now();
      window.location.reload();
    }, maxIntervalMinutes * 60 * 1000);
  };

  // Resetar timer quando há atividade do usuário
  const resetAutoReloadTimer = () => {
    if (autoReloadTimerRef.current) {
      clearTimeout(autoReloadTimerRef.current);
      setupAutoReload();
    }
  };

  useEffect(() => {
    console.log('🔒 useReloadControl initialized - manual reload or 3 minute timer only');
    
    // Configurar timer automático
    setupAutoReload();

    // Detectar atividade do usuário para resetar timer
    const userActivityEvents = ['click', 'keydown', 'scroll', 'mousemove'];
    let activityTimeout: NodeJS.Timeout;

    const handleUserActivity = () => {
      // Debounce para evitar muitos resets
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        resetAutoReloadTimer();
      }, 1000);
    };

    userActivityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Interceptar tentativas de saída/reload com beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Permitir recarregamento manual sempre
      if (!canReload()) {
        console.log('❌ Reload blocked - must wait 3 minutes');
        e.preventDefault();
        e.returnValue = 'Aguarde 3 minutos para recarregar automaticamente ou recarregue manualmente.';
        return e.returnValue;
      } else {
        console.log('✅ Reload allowed');
        lastReloadTimeRef.current = Date.now();
      }
    };

    // Interceptar eventos de visibilidade sem causar reloads
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page became visible - resetting auto-reload timer');
        resetAutoReloadTimer();
      } else {
        console.log('👁️ Page hidden - timer continues');
      }
    };

    const handleFocus = () => {
      console.log('🎯 Window focused - resetting auto-reload timer');
      resetAutoReloadTimer();
    };

    // Adicionar listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      if (autoReloadTimerRef.current) {
        clearTimeout(autoReloadTimerRef.current);
      }
      clearTimeout(activityTimeout);
      
      userActivityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [maxIntervalMinutes, enableAutoReload]);

  return {
    manualReload,
    canReload,
    timeUntilNextReload: () => {
      const now = Date.now();
      const timeSinceLastReload = now - lastReloadTimeRef.current;
      const threeMinutesInMs = maxIntervalMinutes * 60 * 1000;
      return Math.max(0, threeMinutesInMs - timeSinceLastReload);
    }
  };
};
