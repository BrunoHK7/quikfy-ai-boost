
import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminAuth = sessionStorage.getItem('adminAuthenticated');
      const authTime = sessionStorage.getItem('adminAuthTime');
      
      console.log('🔐 useAdminAuth - Checking admin authentication:', {
        adminAuth,
        authTime: authTime ? new Date(parseInt(authTime)).toISOString() : null
      });

      if (adminAuth === 'true' && authTime) {
        const authTimestamp = parseInt(authTime);
        const now = Date.now();
        const hourInMs = 60 * 60 * 1000; // 1 hora
        
        // Verificar se a autenticação não expirou (1 hora)
        if (now - authTimestamp < hourInMs) {
          console.log('✅ useAdminAuth - Admin authentication valid');
          setIsAdminAuthenticated(true);
        } else {
          console.log('⏰ useAdminAuth - Admin authentication expired');
          sessionStorage.removeItem('adminAuthenticated');
          sessionStorage.removeItem('adminAuthTime');
          setIsAdminAuthenticated(false);
        }
      } else {
        console.log('❌ useAdminAuth - No admin authentication found');
        setIsAdminAuthenticated(false);
      }
      
      setLoading(false);
    };

    // Verificação inicial
    checkAdminAuth();

    // Listener para mudanças no sessionStorage (mais eficiente que setInterval)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminAuthenticated' || e.key === 'adminAuthTime') {
        checkAdminAuth();
      }
    };

    // Listener para visibilidade da página (pausar verificações quando aba não está ativa)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Só verifica quando a aba fica visível novamente
        checkAdminAuth();
      }
    };

    // Event listeners mais eficientes
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Verificação periódica mais espaçada e só quando a página está visível
    const interval = setInterval(() => {
      if (!document.hidden) {
        checkAdminAuth();
      }
    }, 5 * 60 * 1000); // 5 minutos em vez de 1 minuto

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const logout = () => {
    console.log('🚪 useAdminAuth - Logging out admin');
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminAuthTime');
    setIsAdminAuthenticated(false);
  };

  return {
    isAdminAuthenticated,
    loading,
    logout
  };
};
