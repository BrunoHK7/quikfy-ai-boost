
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ProfilePhoto {
  id: string;
  user_id: string;
  photo_url: string;
  caption: string;
  created_at: string;
}

export const useProfilePhotos = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPhotos();
    } else {
      setPhotos([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPhotos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profile_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        setPhotos(data || []);
      }
    } catch (error) {
      console.error('Error in fetchPhotos:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File, caption: string = '') => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return { error: uploadError };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from('profile_photos')
        .insert({
          user_id: user.id,
          photo_url: publicUrl,
          caption
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving photo record:', error);
        return { error };
      }

      setPhotos(prev => [data, ...prev]);
      return { data };
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      return { error };
    }
  };

  const deletePhoto = async (photoId: string, photoUrl: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Extract file path from URL
      const fileName = photoUrl.split('/profile-photos/')[1];
      
      // Delete from storage
      await supabase.storage
        .from('profile-photos')
        .remove([fileName]);

      // Delete from database
      const { error } = await supabase
        .from('profile_photos')
        .delete()
        .eq('id', photoId);

      if (error) {
        console.error('Error deleting photo:', error);
        return { error };
      }

      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      return { success: true };
    } catch (error) {
      console.error('Error in deletePhoto:', error);
      return { error };
    }
  };

  return {
    photos,
    loading,
    uploadPhoto,
    deletePhoto,
    refetch: fetchPhotos
  };
};
