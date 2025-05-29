
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

interface UserCredits {
  id: string;
  plan_type: 'free' | 'plus' | 'pro' | 'vip' | 'admin' | 'teste';
  current_credits: number;
  total_credits_ever: number;
  last_reset_date: string;
}

interface CreditHistoryItem {
  id: string;
  action: string;
  credits_used: number;
  credits_before: number;
  credits_after: number;
  status: 'success' | 'refunded' | 'failed';
  description: string | null;
  created_at: string;
}

interface ConsumeCreditsResponse {
  success: boolean;
  error?: string;
  credits_remaining?: number;
  message?: string;
}

export const useCredits = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [creditHistory, setCreditHistory] = useState<CreditHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user credits - simplified for plan-based system
  const fetchUserCredits = async () => {
    if (!user || !profile) return;

    try {
      // Simulate credits based on plan
      const simulatedCredits: UserCredits = {
        id: user.id,
        plan_type: profile.role,
        current_credits: profile.role === 'admin' || profile.role === 'teste' ? -1 : 999999,
        total_credits_ever: profile.role === 'admin' || profile.role === 'teste' ? -1 : 999999,
        last_reset_date: new Date().toISOString()
      };
      
      setUserCredits(simulatedCredits);
    } catch (error) {
      console.error('Error in fetchUserCredits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch credit history - empty for plan-based system
  const fetchCreditHistory = async () => {
    if (!user) return;
    setCreditHistory([]);
  };

  // Consume credits - simplified for plan-based system
  const consumeCredits = async (action: string, creditsToConsume: number, description?: string): Promise<ConsumeCreditsResponse> => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    // Admin and teste users don't consume credits
    if (profile?.role === 'admin' || profile?.role === 'teste') {
      return { 
        success: true, 
        credits_remaining: -1, 
        message: 'Acesso administrativo - sem custo' 
      };
    }

    // For other users, always allow (plan-based access)
    return { 
      success: true, 
      credits_remaining: 999999, 
      message: `${description} - Plano ${profile?.role || 'free'}` 
    };
  };

  // Refund credits - simplified for plan-based system
  const refundCredits = async (creditsToRefund: number, description: string) => {
    if (!user) return false;

    // Admin and teste users don't need refunds since they don't consume credits
    if (profile?.role === 'admin' || profile?.role === 'teste') {
      return true;
    }

    // For other users, always success (plan-based access)
    return true;
  };

  useEffect(() => {
    if (user && profile) {
      fetchUserCredits();
      fetchCreditHistory();
    } else {
      setUserCredits(null);
      setCreditHistory([]);
      setLoading(false);
    }
  }, [user, profile]);

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

  const getPlanCredits = (planType: string) => {
    switch (planType) {
      case 'free': return 'Acesso básico às ferramentas';
      case 'plus': return 'Acesso às ferramentas';
      case 'pro': return 'Acesso completo às ferramentas';
      case 'vip': return 'Acesso ilimitado às ferramentas';
      case 'admin': return 'Acesso administrativo';
      case 'teste': return 'Conta de teste';
      default: return 'Acesso básico';
    }
  };

  return {
    userCredits,
    creditHistory,
    loading,
    consumeCredits,
    refundCredits,
    fetchUserCredits,
    fetchCreditHistory,
    getPlanName,
    getPlanCredits
  };
};
