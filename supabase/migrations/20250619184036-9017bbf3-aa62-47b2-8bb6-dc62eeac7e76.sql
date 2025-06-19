
-- Habilitar RLS na tabela link_pages
ALTER TABLE public.link_pages ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam suas próprias páginas de links
CREATE POLICY "Users can view their own link pages" 
  ON public.link_pages 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários criem suas próprias páginas de links
CREATE POLICY "Users can create their own link pages" 
  ON public.link_pages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem suas próprias páginas de links
CREATE POLICY "Users can update their own link pages" 
  ON public.link_pages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem suas próprias páginas de links
CREATE POLICY "Users can delete their own link pages" 
  ON public.link_pages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Política especial para permitir acesso público às páginas de links (para visualização pública)
CREATE POLICY "Public can view link pages by slug" 
  ON public.link_pages 
  FOR SELECT 
  USING (true);

-- Criar índice único no slug para garantir que não haja duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS link_pages_slug_unique 
  ON public.link_pages (slug);
