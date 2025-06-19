
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const pathname = url.pathname
    
    // Extrair o slug da URL (formato: /quiklink-{slug})
    const match = pathname.match(/^\/quiklink-(.+)$/)
    if (!match) {
      return new Response('Page not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      })
    }
    
    const slug = match[1]
    console.log('🔍 Serving page for slug:', slug)
    
    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Buscar os dados da página no banco
    const { data: linkPage, error: dbError } = await supabase
      .from('link_pages')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .maybeSingle()
    
    if (dbError) {
      console.error('❌ Database error:', dbError)
      return new Response('Database error', { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      })
    }
    
    if (!linkPage) {
      console.log('❌ Page not found for slug:', slug)
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Página não encontrada</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; }
            .error { color: #666; }
          </style>
        </head>
        <body>
          <h1>404 - Página não encontrada</h1>
          <p class="error">A página que você está procurando não existe.</p>
        </body>
        </html>
      `, { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      })
    }
    
    console.log('✅ Found link page data:', linkPage.name)
    
    // Gerar HTML da página
    const pageHtml = generateLinkPageHtml(linkPage)
    
    return new Response(pageHtml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300' // Cache por 5 minutos
      }
    })
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/html' }
    })
  }
})

function generateLinkPageHtml(linkPageData: any): string {
  const buttons = Array.isArray(linkPageData.buttons) ? linkPageData.buttons : []
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${linkPageData.name || 'Página de Links'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${linkPageData.background_color};
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
            color: ${linkPageData.name_color};
            font-family: ${linkPageData.name_font_family};
            font-size: ${Math.round(linkPageData.headline_size * 1.4)}px;
            margin: 0;
        }
        
        .headline {
            line-height: 1.6;
            max-width: 24rem;
            color: ${linkPageData.headline_color};
            font-family: ${linkPageData.headline_font_family};
            font-size: ${linkPageData.headline_size}px;
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
            ${linkPageData.profile_image ? 
                `<img src="${linkPageData.profile_image}" alt="Profile" class="profile-image" />` :
                `<div class="profile-placeholder">Foto</div>`
            }
            
            ${linkPageData.name ? `<h1 class="name">${linkPageData.name}</h1>` : ''}
            
            ${linkPageData.headline ? `<p class="headline">${linkPageData.headline}</p>` : ''}
            
            <div class="buttons">
                ${buttons.length > 0 ? 
                    buttons.map((button: any) => `
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
</html>`
}
