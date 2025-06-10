
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPremium?: boolean;
  requiredPlan?: 'plus' | 'pro' | 'vip';
}

const ProtectedRoute = ({ children, requiresPremium = false, requiredPlan }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  const loading = authLoading || profileLoading || subscriptionLoading;

  if (loading) {
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admins têm acesso total a tudo
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }

  // Usuários teste têm acesso como Pro
  if (profile?.role === 'teste') {
    return <>{children}</>;
  }

  // Verificar plano específico
  if (requiredPlan) {
    const userPlan = subscription.subscribed ? subscription.subscription_tier?.toLowerCase() : 'free';
    
    const planHierarchy = {
      free: 0,
      plus: 1,
      pro: 2,
      vip: 3
    };

    const userPlanLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

    if (userPlanLevel < requiredPlanLevel) {
      return <Navigate to="/pricing" replace />;
    }
  }

  // Se a rota requer premium e o usuário não tem acesso (backward compatibility)
  if (requiresPremium && !subscription.subscribed) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
