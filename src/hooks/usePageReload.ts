
import { useEffect } from 'react';

export const usePageReload = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Previne o recarregamento automático quando a aba volta a ficar visível
      if (document.visibilityState === 'visible') {
        // Remove qualquer listener de beforeunload que possa estar causando recarregamento
        window.onbeforeunload = null;
      }
    };

    const handleFocus = () => {
      // Previne comportamentos indesejados ao focar na janela
      window.onbeforeunload = null;
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // Previne recarregamento quando a página é restaurada do cache
      if (event.persisted) {
        event.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    // Desabilita o recarregamento automático
    window.onbeforeunload = null;

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
};
