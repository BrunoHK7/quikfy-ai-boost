
import { useEffect } from 'react';

export const usePageReload = () => {
  useEffect(() => {
    // Apenas previne F5 - remove todos os outros listeners
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
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
