
import { useEffect } from 'react';

export const usePageReload = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Não fazer nada quando a aba volta a ficar visível
      // Remove qualquer comportamento de recarregamento
    };

    const handleFocus = () => {
      // Não fazer nada ao focar na janela
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // Não recarregar quando a página é restaurada do cache
      if (event.persisted) {
        // Não previne o evento, apenas não faz nada
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Remove qualquer prompt de recarregamento
      event.preventDefault();
      return undefined;
    };

    // Listeners que não fazem nada - apenas previnem comportamentos indesejados
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
