
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

    // Listener APENAS para mudanças no sessionStorage (sem timers ou outros eventos)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminAuthenticated' || e.key === 'adminAuthTime') {
        checkAdminAuth();
      }
    };

    // APENAS storage listener - SEM visibilitychange, focus, intervals ou timers
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
