
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { ReactNode } from "react";

interface AdminAccessWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiresPlan?: 'plus' | 'pro' | 'vip';
}

export const AdminAccessWrapper = ({ children, fallback, requiresPlan }: AdminAccessWrapperProps) => {
  const { profile } = useProfile();
  const { subscription } = useSubscription();
  
  // Admin users get full access to everything - sem exceções
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }
  
  // Usuários teste têm acesso como Pro
  if (profile?.role === 'teste') {
    return <>{children}</>;
  }
  
  // Se não há requisito específico de plano, mostra o conteúdo
  if (!requiresPlan) {
    return <>{children}</>;
  }
  
  // Verificar se tem assinatura ativa e plano adequado
  if (subscription.subscribed && subscription.subscription_tier) {
    const userTier = subscription.subscription_tier.toLowerCase();
    
    const hasRequiredPlan = (() => {
      switch (requiresPlan) {
        case 'plus':
          return ['plus', 'pro', 'vip'].includes(userTier);
        case 'pro':
          return ['pro', 'vip'].includes(userTier);
        case 'vip':
          return userTier === 'vip';
        default:
          return true;
      }
    })();
    
    if (hasRequiredPlan) {
      return <>{children}</>;
    }
  }
  
  // Se não tem acesso, mostra o fallback
  return <>{fallback}</>;
};
