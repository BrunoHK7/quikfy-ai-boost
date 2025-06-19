
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
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
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('link_pages')
          .select('*')
          .eq('slug', slug.toLowerCase())
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading link page:', error);
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!data) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

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

        setLinkPageData(linkPageData);
      } catch (err) {
        console.error('Error loading link page:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadLinkPage();
  }, [slug]);

  const handleButtonClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (notFound || !linkPageData) {
    return <Navigate to="/404" replace />;
  }

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
