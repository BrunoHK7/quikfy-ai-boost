
import React from 'react';
import { LinkPageData } from '@/pages/LinkPageEditor';
import { ExternalLink } from 'lucide-react';

interface LinkPagePreviewProps {
  linkPageData: LinkPageData;
}

export const LinkPagePreview: React.FC<LinkPagePreviewProps> = ({
  linkPageData
}) => {
  const handleButtonClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md mx-auto">
        {/* Simulação de um smartphone */}
        <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-xl">
          <div 
            className="rounded-[2rem] overflow-hidden h-[600px] flex flex-col"
            style={{ backgroundColor: linkPageData.backgroundColor }}
          >
            <div className="flex-1 p-8 flex flex-col items-center text-center">
              {/* Foto de perfil */}
              {linkPageData.profileImage ? (
                <img
                  src={linkPageData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Foto</span>
                </div>
              )}

              {/* Nome */}
              {linkPageData.name && (
                <h1 
                  className="font-bold mb-2"
                  style={{
                    color: linkPageData.nameColor,
                    fontFamily: linkPageData.nameFontFamily,
                    fontSize: linkPageData.headline ? '0.8rem' : '1.25rem' // 40% do tamanho da headline
                  }}
                >
                  {linkPageData.name}
                </h1>
              )}

              {/* Headline */}
              {linkPageData.headline && (
                <p 
                  className="mb-6 leading-relaxed"
                  style={{
                    color: linkPageData.headlineColor,
                    fontFamily: linkPageData.headlineFontFamily,
                    fontSize: '1.25rem' // Tamanho base da headline
                  }}
                >
                  {linkPageData.headline}
                </p>
              )}

              {/* Botões */}
              <div className="w-full space-y-3">
                {linkPageData.buttons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handleButtonClick(button.url)}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
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
                  <p className="text-sm">Adicione botões para começar</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center py-4 px-4">
              <p className="text-xs text-gray-500">
                Criado com Quikfy
              </p>
            </div>
          </div>
        </div>

        {/* URL Preview */}
        {linkPageData.slug && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">quiklinks.quikfy.com.br/</span>
              <span className="text-purple-600 font-semibold">{linkPageData.slug}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
