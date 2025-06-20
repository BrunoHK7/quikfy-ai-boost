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
        console.log('🎨 Background color:', linkPageData.backgroundColor);
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

  // Usar a cor de fundo configurada ou um fallback
  const backgroundColor = linkPageData?.backgroundColor || '#ffffff';

  if (isLoading) {
    return (
      <div 
        style={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor,
          margin: 0,
          padding: 0
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '32px',
            width: '32px',
            border: '2px solid transparent',
            borderTop: '2px solid #9333ea',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !linkPageData) {
    return (
      <div 
        style={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor,
          margin: 0,
          padding: 0
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            {error === 'Página não encontrada' ? '404 - Página não encontrada' : 'Erro'}
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>{error}</p>
          <a href="/" style={{ color: '#9333ea', textDecoration: 'underline' }}>
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: linkPageData.backgroundColor,
        margin: 0
      }}
    >
      <div style={{ width: '100%', maxWidth: '448px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px'
        }}>
          {/* Profile Image */}
          {linkPageData.profileImage ? (
            <img 
              src={linkPageData.profileImage} 
              alt="Profile" 
              style={{
                width: '128px',
                height: '128px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid white',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
          ) : (
            <div style={{
              width: '128px',
              height: '128px',
              borderRadius: '50%',
              backgroundColor: '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Foto
            </div>
          )}

          {/* Name */}
          {linkPageData.name && (
            <h1 
              style={{ 
                color: linkPageData.nameColor,
                fontFamily: linkPageData.nameFontFamily,
                fontSize: `${Math.round(linkPageData.headlineSize * 1.4)}px`,
                fontWeight: 'bold',
                margin: 0
              }}
            >
              {linkPageData.name}
            </h1>
          )}

          {/* Headline */}
          {linkPageData.headline && (
            <p 
              style={{ 
                color: linkPageData.headlineColor,
                fontFamily: linkPageData.headlineFontFamily,
                fontSize: `${linkPageData.headlineSize}px`,
                lineHeight: '1.625',
                maxWidth: '384px',
                margin: 0
              }}
            >
              {linkPageData.headline}
            </p>
          )}

          {/* Buttons */}
          <div style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '384px'
          }}>
            {linkPageData.buttons.length > 0 ? (
              linkPageData.buttons.map((button: any) => (
                <a
                  key={button.id}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    fontWeight: button.fontWeight,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: button.backgroundColor,
                    color: button.textColor,
                    border: button.borderWidth > 0 ? `${button.borderWidth}px solid ${button.borderColor}` : 'none',
                    borderRadius: `${button.borderRadius}px`,
                    fontSize: `${button.fontSize}px`,
                    fontFamily: button.fontFamily,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                >
                  {button.text}
                  {button.url && (
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  )}
                </a>
              ))
            ) : (
              <div style={{ 
                width: '100%',
                padding: '32px',
                textAlign: 'center',
                color: '#9ca3af'
              }}>
                <p>Nenhum link disponível</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', padding: '16px', marginTop: '32px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              <a 
                href="https://www.quikfy.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#6b7280', 
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#9333ea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                Criado com Quikfy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLinkPage;
