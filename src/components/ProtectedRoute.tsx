
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
  requiresPremium?: boolean;
}

const ProtectedRoute = ({ children, requiresAdmin = false, requiresPremium = false }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  console.log('🔒 ProtectedRoute - Debug info:', {
    path: location.pathname,
    user: user ? { id: user.id, email: user.email } : null,
    profile: profile ? { id: profile.id, role: profile.role } : null,
    requiresAdmin,
    requiresPremium,
    authLoading,
    profileLoading,
    subscriptionLoading
  });

  const loading = authLoading || profileLoading || subscriptionLoading;

  if (loading) {
    console.log('🔒 ProtectedRoute - Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔒 ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!user.email_confirmed_at) {
    console.log('🔒 ProtectedRoute - Email not confirmed, redirecting to verification');
    return <Navigate to="/email-verification" replace />;
  }

  // Verificação específica para páginas de admin
  if (requiresAdmin) {
    console.log('🔒 ProtectedRoute - Checking admin access for path:', location.pathname);
    console.log('🔒 ProtectedRoute - User profile:', profile);
    
    if (!profile) {
      console.log('❌ ProtectedRoute - No profile found for admin check');
      return <Navigate to="/" replace />;
    }
    
    if (profile.role !== 'admin') {
      console.log('❌ ProtectedRoute - User role is not admin. Current role:', profile.role);
      return <Navigate to="/" replace />;
    }
    
    console.log('✅ ProtectedRoute - Admin access granted for:', location.pathname);
    return <>{children}</>;
  }

  // Verificação para páginas premium
  if (requiresPremium) {
    console.log('🔒 ProtectedRoute - Checking premium requirement');
    
    // Admin users sempre passam
    if (profile?.role === 'admin') {
      console.log('✅ ProtectedRoute - Admin bypassing premium requirement');
      return <>{children}</>;
    }
    
    // Usuários teste têm acesso como se fossem Pro
    if (profile?.role === 'teste') {
      console.log('✅ ProtectedRoute - Test user bypassing premium requirement');
      return <>{children}</>;
    }
    
    // Verificar assinatura ativa
    if (!subscription.subscribed) {
      console.log('❌ ProtectedRoute - No active subscription, redirecting to pricing');
      return <Navigate to="/pricing" replace />;
    }
    
    console.log('✅ ProtectedRoute - Premium access granted');
  }

  console.log('✅ ProtectedRoute - General access granted for:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
