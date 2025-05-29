
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useSubscription } from './useSubscription';

interface PlanUsage {
  plan_type: 'free' | 'plus' | 'pro' | 'vip' | 'admin' | 'teste';
  hasAccess: boolean;
  description: string;
}

interface ConsumeUseResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const useCarouselUses = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { subscription } = useSubscription();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      setLoading(false);
    }
  }, [user, profile, subscription]);

  // Determinar plano atual baseado na assinatura e profile
  const getCurrentPlanType = (): 'free' | 'plus' | 'pro' | 'vip' | 'admin' | 'teste' => {
    if (!profile) return 'free';
    
    if (profile.role === 'admin') return 'admin';
    if (profile.role === 'teste') return 'teste';
    
    if (subscription.subscribed && subscription.subscription_tier) {
      const tier = subscription.subscription_tier.toLowerCase();
      switch (tier) {
        case 'plus': return 'plus';
        case 'pro': return 'pro';
        case 'vip': return 'vip';
        default: return 'free';
      }
    }
    
    return 'free';
  };

  const getUserUsage = (): PlanUsage => {
    const planType = getCurrentPlanType();
    
    switch (planType) {
      case 'admin':
        return {
          plan_type: 'admin',
          hasAccess: true,
          description: 'Acesso administrativo - sem limitações'
        };
      case 'teste':
        return {
          plan_type: 'teste',
          hasAccess: true,
          description: 'Conta de teste - acesso completo'
        };
      case 'vip':
        return {
          plan_type: 'vip',
          hasAccess: true,
          description: 'Plano VIP - acesso ilimitado'
        };
      case 'pro':
        return {
          plan_type: 'pro',
          hasAccess: true,
          description: 'Plano Pro - acesso completo'
        };
      case 'plus':
        return {
          plan_type: 'plus',
          hasAccess: true,
          description: 'Plano Plus - acesso às ferramentas'
        };
      default:
        return {
          plan_type: 'free',
          hasAccess: true,
          description: 'Plano Free - acesso básico'
        };
    }
  };

  // Simular consumo de uso (agora sempre sucesso, já que todos têm acesso)
  const consumeUse = async (description?: string): Promise<ConsumeUseResponse> => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    const usage = getUserUsage();
    
    if (!usage.hasAccess) {
      return { success: false, error: 'Acesso negado para este plano' };
    }

    return { 
      success: true, 
      message: `${description || 'Operação realizada'} - ${usage.description}`
    };
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'free': return 'Free';
      case 'plus': return 'Plus';
      case 'pro': return 'Pro';
      case 'vip': return 'VIP';
      case 'admin': return 'Admin';
      case 'teste': return 'Teste';
      default: return 'Free';
    }
  };

  const getPlanUses = (planType: string) => {
    switch (planType) {
      case 'free': return 'Acesso básico';
      case 'plus': return 'Acesso às ferramentas';
      case 'pro': return 'Acesso completo';
      case 'vip': return 'Acesso ilimitado';
      case 'admin': return 'Acesso administrativo';
      case 'teste': return 'Conta de teste';
      default: return 'Acesso básico';
    }
  };

  return {
    userUses: getUserUsage(),
    useHistory: [], // Não há mais histórico de usos
    loading,
    consumeUse,
    fetchUserUses: async () => {},
    fetchUseHistory: async () => {},
    getPlanName,
    getPlanUses,
    getCurrentPlanType
  };
};
