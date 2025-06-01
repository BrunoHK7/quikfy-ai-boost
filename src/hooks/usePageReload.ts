
import { useEffect } from 'react';

export const usePageReload = () => {
  useEffect(() => {
    // Apenas previne F5, Ctrl+R e Cmd+R - sem outros listeners problemáticos
    const handleKeyDown = (event: KeyboardEvent) => {
      // Permite F5, Ctrl+R e Cmd+R normalmente (comportamento padrão do navegador)
      // Remove qualquer prevenção que possa estar causando problemas
      return true;
    };

    // Não adiciona listeners que possam interferir com o comportamento normal
    // O hook agora é essencialmente inativo para evitar conflitos
    
    return () => {
      // Cleanup vazio - sem listeners para remover
    };
  }, []);
};
