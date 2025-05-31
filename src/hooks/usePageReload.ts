
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
        // Previne recarregamento do cache
        event.preventDefault();
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Remove qualquer prompt de recarregamento
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    const handlePopState = (event: PopStateEvent) => {
      // Previne navegação indesejada
      event.preventDefault();
    };

    // Listeners que previnem comportamentos indesejados
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Previne refresh com F5 ou Ctrl+R
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
