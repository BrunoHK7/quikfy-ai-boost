
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

interface UserCredits {
  id: string;
  plan_type: 'free' | 'essential' | 'pro' | 'vip' | 'admin';
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

  // Fetch user credits
  const fetchUserCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user credits:', error);
        return;
      }

      if (data) {
        // Type cast the plan_type to ensure it matches our enum
        const typedData: UserCredits = {
          ...data,
          plan_type: data.plan_type as 'free' | 'essential' | 'pro' | 'vip' | 'admin'
        };
        setUserCredits(typedData);
      }
    } catch (error) {
      console.error('Error in fetchUserCredits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch credit history
  const fetchCreditHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('credit_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching credit history:', error);
        return;
      }

      // Type cast the status field and ensure proper typing
      const typedData: CreditHistoryItem[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'success' | 'refunded' | 'failed'
      }));
      setCreditHistory(typedData);
    } catch (error) {
      console.error('Error in fetchCreditHistory:', error);
    }
  };

  // Consume credits - admin users bypass credit consumption
  const consumeCredits = async (action: string, creditsToConsume: number, description?: string): Promise<ConsumeCreditsResponse> => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    // Admin users don't consume credits
    if (profile?.role === 'admin') {
      // Still log the action for tracking purposes
      try {
        await supabase
          .from('credit_history')
          .insert({
            user_id: user.id,
            action: action,
            credits_used: 0,
            credits_before: userCredits?.current_credits || 0,
            credits_after: userCredits?.current_credits || 0,
            status: 'success',
            description: `${description} (Admin - sem custo)`
          });
      } catch (error) {
        console.error('Error logging admin action:', error);
      }
      
      return { 
        success: true, 
        credits_remaining: -1, 
        message: 'Acesso administrativo - sem custo' 
      };
    }

    try {
      const { data, error } = await supabase.rpc('consume_credits', {
        _user_id: user.id,
        _action: action,
        _credits_to_consume: creditsToConsume,
        _description: description
      });

      if (error) {
        console.error('Error consuming credits:', error);
        return { success: false, error: error.message };
      }

      // Safely convert Json response to ConsumeCreditsResponse
      const typedResponse = data as unknown as ConsumeCreditsResponse;

      // Refresh credits after consumption
      await fetchUserCredits();
      await fetchCreditHistory();

      return typedResponse;
    } catch (error) {
      console.error('Error in consumeCredits:', error);
      return { success: false, error: 'Erro interno' };
    }
  };

  // Refund credits
  const refundCredits = async (creditsToRefund: number, description: string) => {
    if (!user) return false;

    // Admin users don't need refunds since they don't consume credits
    if (profile?.role === 'admin') {
      return true;
    }

    try {
      const { data, error } = await supabase.rpc('refund_credits', {
        _user_id: user.id,
        _credits_to_refund: creditsToRefund,
        _description: description
      });

      if (error) {
        console.error('Error refunding credits:', error);
        return false;
      }

      // Refresh credits after refund
      await fetchUserCredits();
      await fetchCreditHistory();

      return data;
    } catch (error) {
      console.error('Error in refundCredits:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserCredits();
      fetchCreditHistory();
    } else {
      setUserCredits(null);
      setCreditHistory([]);
      setLoading(false);
    }
  }, [user]);

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'free': return 'Free';
      case 'essential': return 'Essential';
      case 'pro': return 'Pro';
      case 'vip': return 'VIP';
      case 'admin': return 'Admin';
      default: return 'Free';
    }
  };

  const getPlanCredits = (planType: string) => {
    switch (planType) {
      case 'free': return '3 créditos (não renováveis)';
      case 'essential': return '50 créditos/mês (não cumulativos)';
      case 'pro': return '200 créditos/mês (cumulativos)';
      case 'vip': return '500 créditos/mês (cumulativos)';
      case 'admin': return 'Ilimitado';
      default: return '3 créditos';
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
