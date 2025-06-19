
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('🌐 EDGE FUNCTION CALLED:', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const pathname = url.pathname
    
    console.log('🔍 Full pathname:', pathname)
    
    // Extrair o slug da URL (formato: /quiklink-{slug})
    const match = pathname.match(/\/quiklink-(.+)$/)
    console.log('🔍 Regex match result:', match)
    
    if (!match) {
      console.log('❌ No match found for pathname:', pathname)
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Formato de URL incorreto</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; }
            .error { color: #666; }
            .debug { color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Formato de URL incorreto</h1>
          <p class="error">A URL deve ter o formato: /quiklink-{slug}</p>
          <div class="debug">
            <p>URL recebida: ${pathname}</p>
            <p>Esperado: /quiklink-obrunokurtz</p>
          </div>
        </body>
        </html>
      `, { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      })
    }
    
    const slug = match[1]
    console.log('✅ Extracted slug:', slug)
    
    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('🔧 Supabase URL exists:', !!supabaseUrl)
    console.log('🔧 Service role key exists:', !!supabaseKey)
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing Supabase credentials')
      return new Response('Server configuration error', { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Buscar os dados da página no banco
    console.log('🔍 Searching for page with slug:', slug)
    const { data: linkPage, error: dbError } = await supabase
      .from('link_pages')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .maybeSingle()
    
    console.log('💾 Database query result:', { linkPage: !!linkPage, error: dbError })
    
    if (dbError) {
      console.error('❌ Database error:', dbError)
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Erro no banco de dados</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>Erro no banco de dados</h1>
          <p class="error">${dbError.message}</p>
        </body>
        </html>
      `, { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      })
    }
    
    if (!linkPage) {
      console.log('❌ Page not found for slug:', slug)
      
      // Vamos também verificar que páginas existem
      const { data: allPages } = await supabase.from('link_pages').select('slug')
      console.log('📋 Available pages:', allPages?.map(p => p.slug) || [])
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Página não encontrada</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; }
            .error { color: #666; }
            .debug { color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>404 - Página não encontrada</h1>
          <p class="error">A página "${slug}" não foi encontrada.</p>
          <div class="debug">
            <p>Páginas disponíveis: ${allPages?.map(p => p.slug).join(', ') || 'Nenhuma'}</p>
          </div>
        </body>
        </html>
      `, { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      })
    }
    
    console.log('✅ Found link page data for:', linkPage.name)
    
    // Gerar HTML da página
    const pageHtml = generateLinkPageHtml(linkPage)
    
    console.log('✅ Generated HTML, length:', pageHtml.length)
    
    return new Response(pageHtml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    })
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Erro interno</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; }
          .error { color: #d32f2f; }
        </style>
      </head>
      <body>
        <h1>Erro interno do servidor</h1>
        <p class="error">${error.message}</p>
      </body>
      </html>
    `, { 
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
