
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LinkPageData } from '@/pages/LinkPageEditor';
import { ExternalLink } from 'lucide-react';

const PublicLinkPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [linkPageData, setLinkPageData] = useState<LinkPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadLinkPage = async () => {
      console.log('🌐 PUBLIC PAGE LOADING STARTED');
      console.log('🌐 URL slug from params:', slug);
      console.log('🌐 Full URL:', window.location.href);

      if (!slug) {
        console.log('❌ No slug provided in URL');
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      console.log('🔍 Searching for slug in database:', slug);

      try {
        // Primeiro, vamos verificar se há dados na tabela
        const { data: allPages, error: allError } = await supabase
          .from('link_pages')
          .select('*');
        
        console.log('📊 All link pages in database:', allPages);
        console.log('📊 Total pages found:', allPages?.length || 0);
        
        // Agora vamos buscar a página específica
        const { data, error } = await supabase
          .from('link_pages')
          .select('*')
          .eq('slug', slug.toLowerCase())
          .maybeSingle();

        console.log('🔍 Query result for slug:', slug);
        console.log('🔍 Data found:', data);
        console.log('🔍 Error:', error);

        if (error && error.code !== 'PGRST116') {
          console.error('❌ Database error:', error);
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!data) {
          console.log('❌ No link page found for slug:', slug);
          console.log('❌ Available slugs in database:', allPages?.map(p => p.slug) || []);
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        console.log('✅ Link page data found:', data);

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
          buttons: Array.isArray(data.buttons) ? data.buttons as any[] : []
        };

        console.log('✅ Processed link page data:', linkPageData);
        setLinkPageData(linkPageData);
      } catch (err) {
        console.error('❌ Unexpected error loading link page:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
        console.log('🌐 PUBLIC PAGE LOADING FINISHED');
      }
    };

    loadLinkPage();
  }, [slug]);

  const handleButtonClick = (url: string) => {
    if (url) {
      console.log('🔗 Button clicked, opening URL:', url);
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    console.log('⏳ Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando página...</p>
        </div>
      </div>
    );
  }

  if (notFound || !linkPageData) {
    console.log('❌ Showing 404 page');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
          <p className="text-gray-500">A página de links que você está procurando não existe.</p>
          <p className="text-sm text-gray-400 mt-4">Slug procurado: {slug}</p>
          <p className="text-sm text-gray-400">URL completa: {window.location.href}</p>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering public link page for:', linkPageData.name);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: linkPageData.backgroundColor }}
    >
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Foto de perfil */}
          {linkPageData.profileImage ? (
            <img
              src={linkPageData.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Foto</span>
            </div>
          )}

          {/* Nome */}
          {linkPageData.name && (
            <h1 
              className="font-bold"
              style={{
                color: linkPageData.nameColor,
                fontFamily: linkPageData.nameFontFamily,
                fontSize: `${Math.round(linkPageData.headlineSize * 1.4)}px`
              }}
            >
              {linkPageData.name}
            </h1>
          )}

          {/* Headline */}
          {linkPageData.headline && (
            <p 
              className="leading-relaxed max-w-sm"
              style={{
                color: linkPageData.headlineColor,
                fontFamily: linkPageData.headlineFontFamily,
                fontSize: `${linkPageData.headlineSize}px`
              }}
            >
              {linkPageData.headline}
            </p>
          )}

          {/* Botões */}
          <div className="w-full space-y-4 max-w-sm">
            {linkPageData.buttons.map((button: any) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.url)}
                className="w-full py-4 px-6 font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: button.backgroundColor,
                  color: button.textColor,
                  border: button.borderWidth > 0 ? `${button.borderWidth}px solid ${button.borderColor}` : 'none',
                  borderRadius: `${button.borderRadius}px`,
                  fontWeight: button.fontWeight,
                  fontSize: `${button.fontSize}px`,
                  fontFamily: button.fontFamily
                }}
              >
                {button.text}
                {button.url && <ExternalLink className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {linkPageData.buttons.length === 0 && (
            <div className="w-full py-8 text-center text-gray-400">
              <p className="text-sm">Nenhum link disponível</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-500">
              Criado com Quikfy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLinkPage;
