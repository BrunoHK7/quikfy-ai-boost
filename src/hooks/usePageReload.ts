
import { useEffect } from 'react';

export const usePageReload = () => {
  useEffect(() => {
    // Apenas previne F5 e Ctrl+R - nada mais
    const handleKeyDown = (event: KeyboardEvent) => {
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
