
-- Criar bucket para armazenar as páginas HTML geradas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('link-pages', 'link-pages', true);

-- Criar política para permitir que usuários autenticados façam upload de suas páginas
CREATE POLICY "Users can upload their own link pages"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'link-pages' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Criar política para permitir leitura pública das páginas
CREATE POLICY "Public read access to link pages"
ON storage.objects FOR SELECT
USING (bucket_id = 'link-pages');

-- Criar política para permitir que usuários atualizem suas próprias páginas
CREATE POLICY "Users can update their own link pages"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'link-pages' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Criar política para permitir que usuários deletem suas próprias páginas
CREATE POLICY "Users can delete their own link pages"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'link-pages' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
