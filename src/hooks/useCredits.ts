
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

export const useCredits = () => {
  const { user } = useAuth();
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
        setUserCredits(data);
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

      setCreditHistory(data || []);
    } catch (error) {
      console.error('Error in fetchCreditHistory:', error);
    }
  };

  // Consume credits
  const consumeCredits = async (action: string, creditsToConsume: number, description?: string) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

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

      // Refresh credits after consumption
      await fetchUserCredits();
      await fetchCreditHistory();

      return data;
    } catch (error) {
      console.error('Error in consumeCredits:', error);
      return { success: false, error: 'Erro interno' };
    }
  };

  // Refund credits
  const refundCredits = async (creditsToRefund: number, description: string) => {
    if (!user) return false;

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
