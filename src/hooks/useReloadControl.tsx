
import { useEffect, useRef } from 'react';

interface ReloadControlOptions {
  maxIntervalMinutes?: number;
  enableAutoReload?: boolean;
}

export const useReloadControl = (options: ReloadControlOptions = {}) => {
  const { maxIntervalMinutes = 3, enableAutoReload = true } = options;
  const lastReloadTimeRef = useRef<number>(Date.now());
  const autoReloadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const manualReloadAllowedRef = useRef<boolean>(true);

  // Função para verificar se pode recarregar
  const canReload = (): boolean => {
    const now = Date.now();
    const timeSinceLastReload = now - lastReloadTimeRef.current;
    const threeMinutesInMs = maxIntervalMinutes * 60 * 1000;
    
    // Sempre permite recarregamento manual
    if (manualReloadAllowedRef.current) {
      return true;
    }
    
    // Ou após 3 minutos
    return timeSinceLastReload >= threeMinutesInMs;
  };

  // Função para recarregar manualmente
  const manualReload = () => {
    console.log('🔄 Manual reload triggered');
    lastReloadTimeRef.current = Date.now();
    window.location.reload();
  };

  // Interceptar tentativas de recarregamento automático
  const interceptReload = () => {
    // Interceptar window.location.reload()
    const originalReload = window.location.reload;
    window.location.reload = function() {
      if (canReload()) {
        console.log('✅ Reload allowed');
        lastReloadTimeRef.current = Date.now();
        originalReload.call(window.location);
      } else {
        console.log('❌ Reload blocked - must wait 3 minutes or reload manually');
      }
    };

    // Interceptar window.location.href assignments que podem causar reload
    const originalHref = window.location.href;
    Object.defineProperty(window.location, 'href', {
      get: () => originalHref,
      set: (value: string) => {
        // Se está tentando recarregar a mesma página
        if (value === window.location.href || value === window.location.pathname) {
          if (canReload()) {
            console.log('✅ Navigation reload allowed');
            lastReloadTimeRef.current = Date.now();
            window.location.assign(value);
          } else {
            console.log('❌ Navigation reload blocked');
          }
        } else {
          // Navegação normal para outras páginas
          window.location.assign(value);
        }
      }
    });
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
    // Configurar interceptação de reloads
    interceptReload();
    
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

    // Interceptar eventos que podem causar reload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Só permitir se for recarregamento manual ou após 3 minutos
      if (!canReload()) {
        e.preventDefault();
        e.returnValue = 'Recarregamento bloqueado. Aguarde 3 minutos ou recarregue manualmente.';
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      // Não fazer nada no visibility change para evitar reloads automáticos
      console.log('👁️ Visibility changed, but no reload triggered');
    };

    const handleFocus = () => {
      // Não fazer nada no focus para evitar reloads automáticos
      console.log('🎯 Window focused, but no reload triggered');
    };

    // Adicionar listeners sem causar reloads
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
