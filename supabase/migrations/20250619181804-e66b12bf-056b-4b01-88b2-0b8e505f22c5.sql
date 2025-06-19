
-- Create table for link pages
CREATE TABLE public.link_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  profile_image TEXT,
  name TEXT,
  name_color TEXT NOT NULL DEFAULT '#000000',
  name_font_family TEXT NOT NULL DEFAULT 'Inter',
  headline TEXT,
  headline_color TEXT NOT NULL DEFAULT '#374151',
  headline_font_family TEXT NOT NULL DEFAULT 'Inter',
  headline_size INTEGER NOT NULL DEFAULT 20,
  background_color TEXT NOT NULL DEFAULT '#ffffff',
  buttons JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.link_pages ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own link page
CREATE POLICY "Users can view their own link page" 
  ON public.link_pages 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own link page
CREATE POLICY "Users can create their own link page" 
  ON public.link_pages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own link page
CREATE POLICY "Users can update their own link page" 
  ON public.link_pages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own link page
CREATE POLICY "Users can delete their own link page" 
  ON public.link_pages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create unique constraint to ensure one link page per user
CREATE UNIQUE INDEX link_pages_user_id_unique ON public.link_pages(user_id);
