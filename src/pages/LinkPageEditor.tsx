import React, { useState, useEffect } from 'react';
import { StandardHeader } from '@/components/StandardHeader';
import { LinkPageSidebar } from '@/components/linkpage/LinkPageSidebar';
import { LinkPagePreview } from '@/components/linkpage/LinkPagePreview';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export interface LinkButton {
  id: string;
  text: string;
  url: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  fontWeight: 'normal' | 'bold';
  fontSize: number;
  fontFamily: string;
}

export interface LinkPageData {
  slug: string;
  profileImage: string;
  name: string;
  nameColor: string;
  nameFontFamily: string;
  headline: string;
  headlineColor: string;
  headlineFontFamily: string;
  headlineSize: number;
  backgroundColor: string;
  buttons: LinkButton[];
}

const LinkPageEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [linkPageData, setLinkPageData] = useState<LinkPageData>({
    slug: '',
    profileImage: '',
    name: '',
    nameColor: '#000000',
    nameFontFamily: 'Inter',
    headline: '',
    headlineColor: '#374151',
    headlineFontFamily: 'Inter',
    headlineSize: 20,
    backgroundColor: '#ffffff',
    buttons: []
  });

  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados existentes ao montar o componente
  useEffect(() => {
    if (user) {
      loadExistingLinkPage();
    }
  }, [user]);

  const loadExistingLinkPage = async () => {
    try {
      const { data, error } = await supabase
        .from('link_pages')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading link page:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar página de links',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        setLinkPageData({
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
          buttons: Array.isArray(data.buttons) ? (data.buttons as unknown as LinkButton[]) : []
        });
        setIsSlugAvailable(true);
      }
    } catch (error) {
      console.error('Error loading link page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLinkPageData = (updates: Partial<LinkPageData>) => {
    setLinkPageData(prev => ({ ...prev, ...updates }));
  };

  const addButton = () => {
    const newButton: LinkButton = {
      id: Date.now().toString(),
      text: 'Novo botão',
      url: '',
      textColor: '#ffffff',
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
      borderWidth: 2,
      borderRadius: 8,
      fontWeight: 'normal',
      fontSize: 16,
      fontFamily: 'Inter'
    };
    
    setLinkPageData(prev => ({
      ...prev,
      buttons: [...prev.buttons, newButton]
    }));
    
    setSelectedButtonId(newButton.id);
  };

  const updateButton = (buttonId: string, updates: Partial<LinkButton>) => {
    setLinkPageData(prev => ({
      ...prev,
      buttons: prev.buttons.map(button => 
        button.id === buttonId ? { ...button, ...updates } : button
      )
    }));
  };

  const removeButton = (buttonId: string) => {
    setLinkPageData(prev => ({
      ...prev,
      buttons: prev.buttons.filter(button => button.id !== buttonId)
    }));
    
    if (selectedButtonId === buttonId) {
      setSelectedButtonId(null);
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) {
      setIsSlugAvailable(null);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('link_pages')
        .select('id, user_id')
        .eq('slug', slug.toLowerCase())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking slug:', error);
        return false;
      }

      // Se não encontrou nenhum resultado ou se encontrou mas é do próprio usuário
      const available = !data || data.user_id === user?.id;
      setIsSlugAvailable(available);
      return available;
    } catch (error) {
      console.error('Error checking slug availability:', error);
      setIsSlugAvailable(false);
      return false;
    }
  };

  const saveLinkPage = async () => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para salvar',
        variant: 'destructive',
      });
      return;
    }

    if (!linkPageData.slug) {
      toast({
        title: 'Erro',
        description: 'O slug é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (isSlugAvailable === false) {
      toast({
        title: 'Erro',
        description: 'Este slug não está disponível',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const linkPagePayload = {
        user_id: user.id,
        slug: linkPageData.slug.toLowerCase(),
        profile_image: linkPageData.profileImage,
        name: linkPageData.name,
        name_color: linkPageData.nameColor,
        name_font_family: linkPageData.nameFontFamily,
        headline: linkPageData.headline,
        headline_color: linkPageData.headlineColor,
        headline_font_family: linkPageData.headlineFontFamily,
        headline_size: linkPageData.headlineSize,
        background_color: linkPageData.backgroundColor,
        buttons: linkPageData.buttons as any,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('link_pages')
        .upsert(linkPagePayload, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving link page:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao salvar página de links',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Página de links salva com sucesso!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving link page:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao salvar',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const saveButton = (
    <Button 
      onClick={saveLinkPage} 
      disabled={isSaving || !linkPageData.slug || isSlugAvailable === false}
      className="flex items-center gap-2"
    >
      <Save className="w-4 h-4" />
      {isSaving ? 'Salvando...' : 'Salvar'}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <StandardHeader title="Editor de Página de Links" rightContent={saveButton} />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - 40% */}
        <div className="w-2/5 bg-white border-r border-gray-200 overflow-y-auto">
          <LinkPageSidebar
            linkPageData={linkPageData}
            updateLinkPageData={updateLinkPageData}
            selectedButtonId={selectedButtonId}
            setSelectedButtonId={setSelectedButtonId}
            addButton={addButton}
            updateButton={updateButton}
            removeButton={removeButton}
            isSlugAvailable={isSlugAvailable}
            checkSlugAvailability={checkSlugAvailability}
          />
        </div>

        {/* Preview - 60% */}
        <div className="w-3/5 bg-gray-100 overflow-y-auto">
          <LinkPagePreview linkPageData={linkPageData} />
        </div>
      </div>
    </div>
  );
};

export default LinkPageEditor;
