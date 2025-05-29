
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { Navigate } from "react-router-dom";
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

  const loading = authLoading || profileLoading || subscriptionLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.email_confirmed_at) {
    return <Navigate to="/email-verification" replace />;
  }

  // Admin users bypass all restrictions
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }

  // Check admin requirement
  if (requiresAdmin) {
    return <Navigate to="/pricing" replace />;
  }

  // Check premium requirement
  if (requiresPremium) {
    // Usuários teste têm acesso como se fossem Pro
    if (profile?.role === 'teste') {
      return <>{children}</>;
    }
    
    // Verificar se tem assinatura ativa
    if (!subscription.subscribed) {
      return <Navigate to="/pricing" replace />;
    }
  }

  // Todos os usuários autenticados têm acesso às ferramentas básicas
  return <>{children}</>;
};

export default ProtectedRoute;
