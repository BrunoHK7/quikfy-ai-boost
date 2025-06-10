
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  // Reduzir logs em produção para melhorar performance
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ AdminProtectedRoute - Current state:', {
      path: location.pathname,
      isAdminAuthenticated,
      loading
    });
  }

  if (loading) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ AdminProtectedRoute - Still loading...');
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ AdminProtectedRoute - Not authenticated, redirecting to admin auth');
    }
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin-auth?returnTo=${returnTo}`} replace />;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ AdminProtectedRoute - Access granted');
  }
  return <>{children}</>;
};

export default AdminProtectedRoute;
