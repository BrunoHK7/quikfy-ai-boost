
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
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

  if (authLoading || profileLoading) {
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

  // Admin users bypass all restrictions and have full access to everything
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }

  // Check admin requirement (apenas para funcionalidades específicas de admin)
  if (requiresAdmin) {
    return <Navigate to="/pricing" replace />;
  }

  // Check premium requirement (apenas para cursos e conteúdo premium)
  // Admin já foi verificado acima, então aqui verificamos apenas usuários não-admin
  if (requiresPremium && !['essential', 'pro', 'vip'].includes(profile?.role || '')) {
    return <Navigate to="/pricing" replace />;
  }

  // Todos os usuários autenticados têm acesso às ferramentas
  // As ferramentas controlam o acesso via sistema de créditos
  return <>{children}</>;
};

export default ProtectedRoute;
