
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  occupation: string;
  bio: string;
  avatar_url: string;
  role: 'free' | 'plus' | 'pro' | 'vip' | 'admin' | 'teste';
  show_public_profile: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrCreateProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchOrCreateProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      
      // Try to fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Profile found:', data);
        
        // Only force admin role for specific user if they don't already have it
        if (user.id === 'f870ffbc-d23a-458d-bac5-131291b5676d' && data.role !== 'admin') {
          console.log('Forcing admin role for specific user');
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id)
            .select()
            .single();
          
          if (updateError) {
            console.error('Error updating role to admin:', updateError);
            setProfile(data);
          } else {
            console.log('Role updated to admin:', updatedProfile);
            setProfile(updatedProfile);
          }
        } else {
          console.log('Profile loaded without role change:', data);
          setProfile(data);
        }
      } else {
        console.log('No profile found, creating new profile');
        // Create a new profile if none exists
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          phone: user.user_metadata?.phone || '',
          city: user.user_metadata?.city || '',
          state: user.user_metadata?.state || '',
          country: user.user_metadata?.country || '',
          occupation: user.user_metadata?.occupation || '',
          bio: '',
          avatar_url: '',
          role: user.id === 'f870ffbc-d23a-458d-bac5-131291b5676d' ? 'admin' as const : 'free' as const,
          show_public_profile: false
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          console.log('Profile created:', createdProfile);
          setProfile(createdProfile);
        }
      }
    } catch (error) {
      console.error('Error in fetchOrCreateProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      } else {
        console.log('Profile updated:', data);
        setProfile(data);
        return { data };
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return { error: uploadError };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });
      
      if (updateError) {
        return { error: updateError };
      }

      return { data: publicUrl };
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return { error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    refetch: fetchOrCreateProfile
  };
};
