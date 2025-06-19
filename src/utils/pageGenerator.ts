
import { LinkPageData } from '@/pages/LinkPageEditor';

export const generateStaticPage = (linkPageData: LinkPageData): string => {
  const { 
    slug, 
    profileImage, 
    name, 
    nameColor, 
    nameFontFamily, 
    headline, 
    headlineColor, 
    headlineFontFamily, 
    headlineSize, 
    backgroundColor, 
    buttons 
  } = linkPageData;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name || 'Página de Links'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${backgroundColor};
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .container {
            width: 100%;
            max-width: 28rem;
            margin: 0 auto;
        }
        
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.5rem;
        }
        
        .profile-image {
            width: 8rem;
            height: 8rem;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .profile-placeholder {
            width: 8rem;
            height: 8rem;
            border-radius: 50%;
            background-color: #d1d5db;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .name {
            font-weight: bold;
            color: ${nameColor};
            font-family: ${nameFontFamily};
            font-size: ${Math.round(headlineSize * 1.4)}px;
            margin: 0;
        }
        
        .headline {
            line-height: 1.6;
            max-width: 24rem;
            color: ${headlineColor};
            font-family: ${headlineFontFamily};
            font-size: ${headlineSize}px;
            margin: 0;
        }
        
        .buttons {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 24rem;
        }
        
        .button {
            width: 100%;
            padding: 1rem 1.5rem;
            font-weight: 500;
            transition: all 0.2s;
            cursor: pointer;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .button:hover {
            transform: scale(1.05);
        }
        
        .button:active {
            transform: scale(0.95);
        }
        
        .footer {
            text-align: center;
            padding: 1rem;
            margin-top: 2rem;
        }
        
        .footer p {
            font-size: 0.75rem;
            color: #6b7280;
        }
        
        .no-links {
            width: 100%;
            padding: 2rem;
            text-align: center;
            color: #9ca3af;
        }
        
        .external-icon {
            width: 1rem;
            height: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            ${profileImage ? 
                `<img src="${profileImage}" alt="Profile" class="profile-image" />` :
                `<div class="profile-placeholder">Foto</div>`
            }
            
            ${name ? `<h1 class="name">${name}</h1>` : ''}
            
            ${headline ? `<p class="headline">${headline}</p>` : ''}
            
            <div class="buttons">
                ${buttons.length > 0 ? 
                    buttons.map(button => `
                        <a 
                            href="${button.url}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="button"
                            style="
                                background-color: ${button.backgroundColor};
                                color: ${button.textColor};
                                border: ${button.borderWidth > 0 ? `${button.borderWidth}px solid ${button.borderColor}` : 'none'};
                                border-radius: ${button.borderRadius}px;
                                font-weight: ${button.fontWeight};
                                font-size: ${button.fontSize}px;
                                font-family: ${button.fontFamily};
                            "
                        >
                            ${button.text}
                            ${button.url ? '<svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' : ''}
                        </a>
                    `).join('') :
                    `<div class="no-links">
                        <p>Nenhum link disponível</p>
                    </div>`
                }
            </div>
            
            <div class="footer">
                <p>Criado com Quikfy</p>
            </div>
        </div>
    </div>
</body>
</html>`;
};

export const downloadPage = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
