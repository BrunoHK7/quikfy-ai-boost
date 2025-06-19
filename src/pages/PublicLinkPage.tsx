
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LinkPageData } from '@/pages/LinkPageEditor';

const PublicLinkPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [linkPageData, setLinkPageData] = useState<LinkPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLinkPage = async () => {
      if (!slug) {
        setError('Slug não encontrado');
        setIsLoading(false);
        return;
      }

      console.log('🔍 Loading public link page for slug:', slug);

      try {
        const { data, error: dbError } = await supabase
          .from('link_pages')
          .select('*')
          .eq('slug', slug.toLowerCase())
          .maybeSingle();

        console.log('💾 Database result:', { data: !!data, error: dbError });

        if (dbError) {
          console.error('❌ Database error:', dbError);
          setError('Erro ao carregar página');
          return;
        }

        if (!data) {
          console.log('❌ Page not found for slug:', slug);
          setError('Página não encontrada');
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

        console.log('✅ Link page loaded successfully:', linkPageData.name);
        setLinkPageData(linkPageData);

      } catch (error) {
        console.error('❌ Error loading link page:', error);
        setError('Erro inesperado');
      } finally {
        setIsLoading(false);
      }
    };

    loadLinkPage();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !linkPageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error === 'Página não encontrada' ? '404 - Página não encontrada' : 'Erro'}
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/" className="text-purple-600 hover:underline">
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: linkPageData.backgroundColor }}
    >
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Profile Image */}
          {linkPageData.profileImage ? (
            <img 
              src={linkPageData.profileImage} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
              Foto
            </div>
          )}

          {/* Name */}
          {linkPageData.name && (
            <h1 
              className="font-bold m-0"
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
              className="leading-relaxed max-w-96 m-0"
              style={{ 
                color: linkPageData.headlineColor,
                fontFamily: linkPageData.headlineFontFamily,
                fontSize: `${linkPageData.headlineSize}px`
              }}
            >
              {linkPageData.headline}
            </p>
          )}

          {/* Buttons */}
          <div className="w-full flex flex-col gap-4 max-w-96">
            {linkPageData.buttons.length > 0 ? (
              linkPageData.buttons.map((button: any) => (
                <a
                  key={button.id}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-4 font-medium transition-all cursor-pointer no-underline flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: button.backgroundColor,
                    color: button.textColor,
                    border: button.borderWidth > 0 ? `${button.borderWidth}px solid ${button.borderColor}` : 'none',
                    borderRadius: `${button.borderRadius}px`,
                    fontWeight: button.fontWeight,
                    fontSize: `${button.fontSize}px`,
                    fontFamily: button.fontFamily,
                  }}
                >
                  {button.text}
                  {button.url && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  )}
                </a>
              ))
            ) : (
              <div className="w-full p-8 text-center text-gray-400">
                <p>Nenhum link disponível</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center p-4 mt-8">
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
