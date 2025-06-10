
import { useEffect, useRef } from 'react';

interface ReloadControlOptions {
  maxIntervalMinutes?: number;
  enableAutoReload?: boolean;
}

export const useReloadControl = (options: ReloadControlOptions = {}) => {
  const { maxIntervalMinutes = 3, enableAutoReload = true } = options;
  const lastReloadTimeRef = useRef<number>(Date.now());
  const autoReloadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef<boolean>(false);

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
    sessionStorage.setItem('quikfy_manual_reload', 'true');
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
      sessionStorage.setItem('quikfy_auto_reload', 'true');
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

  // Bloquear completamente reloads não autorizados
  const blockUnauthorizedReloads = () => {
    // Interceptar F5 e Ctrl+R
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        const manualReload = sessionStorage.getItem('quikfy_manual_reload');
        const autoReload = sessionStorage.getItem('quikfy_auto_reload');
        
        if (!manualReload && !autoReload && !canReload()) {
          e.preventDefault();
          e.stopPropagation();
          console.log('❌ F5/Ctrl+R blocked - must wait 3 minutes');
          return false;
        }
      }
    };

    // Interceptar navegação programática
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      console.log('🔗 Navigation via pushState allowed');
      return originalPushState.apply(this, args);
    };
    
    history.replaceState = function(...args) {
      console.log('🔗 Navigation via replaceState allowed');
      return originalReplaceState.apply(this, args);
    };

    // Interceptar cliques em links que podem causar reload
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href === window.location.href) {
        const manualReload = sessionStorage.getItem('quikfy_manual_reload');
        const autoReload = sessionStorage.getItem('quikfy_auto_reload');
        
        if (!manualReload && !autoReload && !canReload()) {
          e.preventDefault();
          e.stopPropagation();
          console.log('❌ Same-page link blocked - must wait 3 minutes');
          return false;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('click', handleLinkClick, { capture: true });
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    console.log('🔒 useReloadControl initialized - STRICT MODE: manual reload or 3 minute timer only');
    
    // Limpar flags de reload autorizados na inicialização
    sessionStorage.removeItem('quikfy_manual_reload');
    sessionStorage.removeItem('quikfy_auto_reload');
    
    // Configurar timer automático
    setupAutoReload();

    // Configurar bloqueio de reloads não autorizados
    const cleanupBlocker = blockUnauthorizedReloads();

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
      const manualReload = sessionStorage.getItem('quikfy_manual_reload');
      const autoReload = sessionStorage.getItem('quikfy_auto_reload');
      
      // Permitir se for reload autorizado ou após 3 minutos
      if (manualReload || autoReload || canReload()) {
        console.log('✅ Reload allowed');
        lastReloadTimeRef.current = Date.now();
        // Limpar flags após uso
        sessionStorage.removeItem('quikfy_manual_reload');
        sessionStorage.removeItem('quikfy_auto_reload');
      } else {
        console.log('❌ Reload blocked - must wait 3 minutes');
        e.preventDefault();
        e.returnValue = 'Aguarde 3 minutos para recarregar automaticamente ou use Ctrl+F5 para recarregar manualmente.';
        return e.returnValue;
      }
    };

    // Interceptar eventos de visibilidade SEM causar reloads
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page became visible - resetting auto-reload timer only');
        resetAutoReloadTimer();
      } else {
        console.log('👁️ Page hidden - timer continues running');
      }
    };

    const handleFocus = () => {
      console.log('🎯 Window focused - resetting auto-reload timer only');
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
      
      cleanupBlocker();
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
