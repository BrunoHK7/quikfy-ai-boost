
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LinkPageData } from '@/pages/LinkPageEditor';

export const useLinkPages = () => {
  const { user } = useAuth();
  const [linkPage, setLinkPage] = useState<LinkPageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLinkPage = async () => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('link_pages')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const linkPageData: LinkPageData = {
          slug: data.slug,
          profileImage: data.profile_image || '',
          name: data.name || '',
          nameColor: data.name_color,
          nameFontFamily: data.name_font_family,
          headline: data.headline || '',
          headlineColor: data.headline_color,
          headlineFontFamily: data.headline_font_family,
          headlineSize: data.headline_size,
          backgroundColor: data.background_color,
          buttons: data.buttons || []
        };
        setLinkPage(linkPageData);
        return linkPageData;
      }

      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const hasLinkPage = async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('link_pages')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking link page:', err);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadLinkPage();
    }
  }, [user]);

  return {
    linkPage,
    isLoading,
    error,
    loadLinkPage,
    hasLinkPage
  };
};
