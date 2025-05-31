
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserPreferences {
  id: string;
  user_id: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrCreatePreferences();
    } else {
      setPreferences(null);
      setLoading(false);
    }
  }, [user]);

  const fetchOrCreatePreferences = async () => {
    if (!user) return;

    try {
      console.log('Fetching preferences for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching preferences:', error);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Preferences found:', data);
        setPreferences(data);
      } else {
        console.log('No preferences found, creating new preferences');
        const newPreferences = {
          user_id: user.id,
          language: 'pt'
        };

        const { data: createdPreferences, error: createError } = await supabase
          .from('user_preferences')
          .insert(newPreferences)
          .select()
          .single();

        if (createError) {
          console.error('Error creating preferences:', createError);
        } else {
          console.log('Preferences created:', createdPreferences);
          setPreferences(createdPreferences);
        }
      }
    } catch (error) {
      console.error('Error in fetchOrCreatePreferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<Pick<UserPreferences, 'language'>>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating preferences:', error);
        return { error };
      } else {
        console.log('Preferences updated:', data);
        setPreferences(data);
        return { data };
      }
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return { error };
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: fetchOrCreatePreferences
  };
};
