
import React, { useState, useEffect } from 'react';
import { StandardHeader } from '@/components/StandardHeader';
import { LinkPageSidebar } from '@/components/linkpage/LinkPageSidebar';
import { LinkPagePreview } from '@/components/linkpage/LinkPagePreview';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Save, ExternalLink, Download, Globe } from 'lucide-react';
import { generateStaticPage, downloadPage, publishPageOnline } from '@/utils/pageGenerator';

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
  const [isPublishing, setIsPublishing] = useState(false);

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

    console.log('🔍 Checking slug availability for:', slug);

    try {
      const { data, error } = await supabase
        .from('link_pages')
        .select('id, user_id')
        .eq('slug', slug.toLowerCase())
        .maybeSingle();

      console.log('🔍 Slug check result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error checking slug:', error);
        return false;
      }

      // Se não encontrou nenhum resultado ou se encontrou mas é do próprio usuário
      const available = !data || data.user_id === user?.id;
      setIsSlugAvailable(available);
      console.log('✅ Slug available:', available);
      return available;
    } catch (error) {
      console.error('❌ Error checking slug availability:', error);
      setIsSlugAvailable(false);
      return false;
    }
  };

  const saveLinkPage = async () => {
    if (!user) {
      console.error('❌ No user found');
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para salvar',
        variant: 'destructive',
      });
      return;
    }

    if (!linkPageData.slug) {
      console.error('❌ No slug provided');
      toast({
        title: 'Erro',
        description: 'O slug é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (isSlugAvailable === false) {
      console.error('❌ Slug not available');
      toast({
        title: 'Erro',
        description: 'Este slug não está disponível',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    console.log('💾 STARTING SAVE PROCESS');
    console.log('💾 Saving link page with data:', linkPageData);
    console.log('💾 User ID:', user.id);

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

      console.log('💾 Payload to save:', linkPagePayload);

      const { data, error } = await supabase
        .from('link_pages')
        .upsert(linkPagePayload, {
          onConflict: 'user_id'
        })
        .select();

      console.log('💾 Save result:', { data, error });

      if (error) {
        console.error('❌ Error saving link page:', error);
        toast({
          title: 'Erro',
          description: `Erro ao salvar página de links: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Link page saved successfully. Data:', data);

      // Primeira verificação - buscar pela slug específica
      console.log('🔍 VERIFICATION 1: Searching by slug...');
      const { data: verification1, error: verifyError1 } = await supabase
        .from('link_pages')
        .select('*')
        .eq('slug', linkPageData.slug.toLowerCase())
        .maybeSingle();

      console.log('🔍 VERIFICATION 1 result:', { verification1, verifyError1 });

      // Segunda verificação - buscar por user_id
      console.log('🔍 VERIFICATION 2: Searching by user_id...');
      const { data: verification2, error: verifyError2 } = await supabase
        .from('link_pages')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('🔍 VERIFICATION 2 result:', { verification2, verifyError2 });

      // Terceira verificação - listar todas as páginas
      console.log('🔍 VERIFICATION 3: List all link pages...');
      const { data: allPages, error: allError } = await supabase
        .from('link_pages')
        .select('*');

      console.log('🔍 VERIFICATION 3 result:', { allPages, allError });
      console.log('📊 Total pages in database:', allPages?.length || 0);

      if (verification1) {
        console.log('✅ PAGE EXISTS IN DATABASE - Public URL should work:', `/quiklink-${linkPageData.slug}`);
        toast({
          title: 'Sucesso',
          description: 'Página de links salva com sucesso! Sua página está disponível publicamente.',
          variant: 'default',
        });
      } else {
        console.error('❌ PAGE NOT FOUND IN DATABASE after save!');
        toast({
          title: 'Aviso',
          description: 'Página foi salva mas não foi encontrada na verificação. Verifique os logs.',
          variant: 'destructive',
        });
      }

    } catch (error) {
      console.error('❌ Error saving link page:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao salvar',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testPublicAccess = async () => {
    if (!linkPageData.slug) {
      toast({
        title: 'Erro',
        description: 'Defina um slug primeiro',
        variant: 'destructive',
      });
      return;
    }

    console.log('🧪 TESTING PUBLIC ACCESS for slug:', linkPageData.slug);
    
    try {
      // Teste de acesso público (sem autenticação)
      const { data, error } = await supabase
        .from('link_pages')
        .select('*')
        .eq('slug', linkPageData.slug.toLowerCase())
        .maybeSingle();

      console.log('🧪 PUBLIC ACCESS TEST result:', { data, error });

      if (data) {
        console.log('✅ PUBLIC ACCESS: Page can be accessed publicly');
        toast({
          title: 'Teste passou',
          description: 'A página pode ser acessada publicamente!',
          variant: 'default',
        });
      } else {
        console.error('❌ PUBLIC ACCESS: Page cannot be accessed publicly');
        toast({
          title: 'Teste falhou',
          description: 'A página não pode ser acessada publicamente',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Error testing public access:', error);
      toast({
        title: 'Erro no teste',
        description: 'Erro ao testar acesso público',
        variant: 'destructive',
      });
    }
  };

  const viewLinkPage = () => {
    if (linkPageData.slug) {
      const url = `https://ctzzjfasmnimbskpphuy.supabase.co/functions/v1/serve-link-page/quiklink-${linkPageData.slug}`;
      console.log('🌐 Opening link page:', url);
      window.open(url, '_blank');
    }
  };

  const publishPageOnPlatform = async () => {
    if (!linkPageData.slug) {
      toast({
        title: 'Erro',
        description: 'Defina um slug primeiro',
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

    setIsPublishing(true);
    console.log('🚀 STARTING ONLINE PUBLICATION for:', linkPageData.slug);
    
    try {
      // Primeiro, salvar os dados no banco
      await saveLinkPage();
      
      // Depois, publicar a página online
      const publicUrl = await publishPageOnline(linkPageData);
      
      console.log('✅ Page published online at:', publicUrl);
      
      toast({
        title: 'Página publicada!',
        description: `Sua página está disponível em: ${publicUrl}`,
        variant: 'default',
      });
      
    } catch (error) {
      console.error('❌ Error publishing page:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao publicar a página online',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const downloadStaticPage = () => {
    if (!linkPageData.slug) {
      toast({
        title: 'Erro',
        description: 'Defina um slug primeiro',
        variant: 'destructive',
      });
      return;
    }

    console.log('📄 GENERATING STATIC PAGE for download:', linkPageData.slug);
    
    try {
      const pageContent = generateStaticPage(linkPageData);
      const filename = `${linkPageData.slug}.html`;
      
      downloadPage(pageContent, filename);
      
      console.log('✅ Static page generated and downloaded:', filename);
      
      toast({
        title: 'Página baixada!',
        description: `A página ${filename} foi gerada e baixada.`,
        variant: 'default',
      });
      
    } catch (error) {
      console.error('❌ Error generating page:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar a página',
        variant: 'destructive',
      });
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

  const rightContent = (
    <div className="flex items-center gap-2">
      <Button 
        onClick={testPublicAccess}
        variant="outline"
        className="flex items-center gap-2"
        disabled={!linkPageData.slug}
      >
        🧪 Testar
      </Button>
      {linkPageData.slug && isSlugAvailable !== false && (
        <Button 
          onClick={viewLinkPage}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Visualizar
        </Button>
      )}
      <Button 
        onClick={downloadStaticPage}
        variant="outline"
        disabled={!linkPageData.slug}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Baixar HTML
      </Button>
      <Button 
        onClick={publishPageOnPlatform}
        variant="purple"
        disabled={!linkPageData.slug || isSlugAvailable === false || isPublishing}
        className="flex items-center gap-2"
      >
        <Globe className="w-4 h-4" />
        {isPublishing ? 'Publicando...' : 'Publicar Online'}
      </Button>
      <Button 
        onClick={saveLinkPage} 
        disabled={isSaving || !linkPageData.slug || isSlugAvailable === false}
        className="flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {isSaving ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <StandardHeader title="Editor de Página de Links" rightContent={rightContent} />
      
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
