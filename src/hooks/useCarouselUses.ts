
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useSubscription } from './useSubscription';

interface UserUses {
  id: string;
  plan_type: 'free' | 'plus' | 'pro' | 'vip' | 'admin';
  current_uses: number;
  total_uses_ever: number;
  last_reset_date: string;
}

interface UseHistoryItem {
  id: string;
  action: string;
  description: string | null;
  created_at: string;
}

interface ConsumeUseResponse {
  success: boolean;
  error?: string;
  uses_remaining?: number;
  message?: string;
}

export const useCarouselUses = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { subscription } = useSubscription();
  const [userUses, setUserUses] = useState<UserUses | null>(null);
  const [useHistory, setUseHistory] = useState<UseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current plan type based on subscription and profile
  const getCurrentPlanType = () => {
    if (profile?.role === 'admin') return 'admin';
    if (subscription.subscribed) {
      switch (subscription.subscription_tier) {
        case 'Plus': return 'plus';
        case 'Pro': return 'pro';
        case 'VIP': return 'vip';
        default: return 'free';
      }
    }
    return 'free';
  };

  // Get max uses for each plan
  const getMaxUses = (planType: string) => {
    switch (planType) {
      case 'free': return 3;
      case 'plus': return 10;
      case 'pro': return 30;
      case 'vip': return -1; // unlimited
      case 'admin': return -1; // unlimited
      default: return 3;
    }
  };

  // Fetch or create user uses record
  const fetchUserUses = async () => {
    if (!user) return;

    try {
      const currentPlan = getCurrentPlanType();
      
      let { data, error } = await supabase
        .from('carousel_uses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Create new record if doesn't exist
        const maxUses = getMaxUses(currentPlan);
        const { data: newData, error: insertError } = await supabase
          .from('carousel_uses')
          .insert({
            user_id: user.id,
            plan_type: currentPlan,
            current_uses: maxUses === -1 ? 999999 : maxUses,
            total_uses_ever: maxUses === -1 ? 999999 : maxUses
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating carousel uses record:', insertError);
          return;
        }
        data = newData;
      } else if (error) {
        console.error('Error fetching carousel uses:', error);
        return;
      }

      if (data) {
        const typedData: UserUses = {
          ...data,
          plan_type: data.plan_type as 'free' | 'plus' | 'pro' | 'vip' | 'admin'
        };
        setUserUses(typedData);
      }
    } catch (error) {
      console.error('Error in fetchUserUses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch use history
  const fetchUseHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('carousel_use_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching use history:', error);
        return;
      }

      setUseHistory(data || []);
    } catch (error) {
      console.error('Error in fetchUseHistory:', error);
    }
  };

  // Consume a use
  const consumeUse = async (description?: string): Promise<ConsumeUseResponse> => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    const currentPlan = getCurrentPlanType();
    
    // Admin and VIP users have unlimited uses
    if (currentPlan === 'admin' || currentPlan === 'vip') {
      // Log the action for tracking
      try {
        await supabase
          .from('carousel_use_history')
          .insert({
            user_id: user.id,
            action: 'carousel_generation',
            description: `${description} (${currentPlan === 'admin' ? 'Admin' : 'VIP'} - ilimitado)`
          });
      } catch (error) {
        console.error('Error logging unlimited use:', error);
      }
      
      return { 
        success: true, 
        uses_remaining: -1, 
        message: currentPlan === 'admin' ? 'Acesso administrativo - usos ilimitados' : 'Plano VIP - usos ilimitados'
      };
    }

    if (!userUses || userUses.current_uses <= 0) {
      return { success: false, error: 'Usos esgotados para este plano' };
    }

    try {
      const newUseCount = userUses.current_uses - 1;
      
      // Update uses count
      const { error: updateError } = await supabase
        .from('carousel_uses')
        .update({ 
          current_uses: newUseCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating uses:', updateError);
        return { success: false, error: updateError.message };
      }

      // Log the use
      await supabase
        .from('carousel_use_history')
        .insert({
          user_id: user.id,
          action: 'carousel_generation',
          description: description || 'Geração de carrossel com IA'
        });

      // Refresh data
      await fetchUserUses();
      await fetchUseHistory();

      return { 
        success: true, 
        uses_remaining: newUseCount,
        message: `Uso consumido. ${newUseCount} usos restantes.`
      };
    } catch (error) {
      console.error('Error in consumeUse:', error);
      return { success: false, error: 'Erro interno' };
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserUses();
      fetchUseHistory();
    } else {
      setUserUses(null);
      setUseHistory([]);
      setLoading(false);
    }
  }, [user, subscription]);

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'free': return 'Free';
      case 'plus': return 'Plus';
      case 'pro': return 'Pro';
      case 'vip': return 'VIP';
      case 'admin': return 'Admin';
      default: return 'Free';
    }
  };

  const getPlanUses = (planType: string) => {
    switch (planType) {
      case 'free': return '3 usos';
      case 'plus': return '10 usos';
      case 'pro': return '30 usos';
      case 'vip': return 'Usos ilimitados';
      case 'admin': return 'Usos ilimitados';
      default: return '3 usos';
    }
  };

  return {
    userUses,
    useHistory,
    loading,
    consumeUse,
    fetchUserUses,
    fetchUseHistory,
    getPlanName,
    getPlanUses,
    getCurrentPlanType
  };
};
