
import { useEffect } from 'react';

export const usePageReload = () => {
  useEffect(() => {
    // Apenas previne F5 e Ctrl+R - sem interferir em mudanças de aba
    const handleKeyDown = (event: KeyboardEvent) => {
      // Previne apenas F5 e Ctrl+R
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
