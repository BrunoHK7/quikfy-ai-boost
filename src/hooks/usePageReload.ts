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

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Apenas previne o prompt de saída em algumas situações
      // Não bloqueia completamente a navegação
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    // Previne apenas F5 e Ctrl+R (refresh manual)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        return false;
      }
    };

    // Listeners mais suaves - não impedem navegação normal
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
