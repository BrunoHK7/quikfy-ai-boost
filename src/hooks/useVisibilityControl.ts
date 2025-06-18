
import { useEffect, useRef } from 'react';

interface UseVisibilityControlOptions {
  onVisibilityChange?: (isVisible: boolean) => void;
  preventUnload?: boolean;
}

export const useVisibilityControl = ({ 
  onVisibilityChange, 
  preventUnload = false 
}: UseVisibilityControlOptions = {}) => {
  const isVisible = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      isVisible.current = visible;
      onVisibilityChange?.(visible);
    };

    const handleFocus = () => {
      isVisible.current = true;
      onVisibilityChange?.(true);
    };

    const handleBlur = () => {
      isVisible.current = false;
      onVisibilityChange?.(false);
    };

    // Prevent page unload if needed
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (preventUnload) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    if (preventUnload) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      if (preventUnload) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, [onVisibilityChange, preventUnload]);

  return isVisible.current;
};
