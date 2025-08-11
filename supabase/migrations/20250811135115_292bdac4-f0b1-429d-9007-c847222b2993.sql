-- Create collections table
CREATE TABLE public.collections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create collection_articles junction table
CREATE TABLE public.collection_articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  article_id uuid NOT NULL,
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(collection_id, article_id)
);

-- Enable Row Level Security
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_articles ENABLE ROW LEVEL SECURITY;

-- Collections policies
CREATE POLICY "Users can view their own collections" 
ON public.collections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public collections" 
ON public.collections 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create their own collections" 
ON public.collections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" 
ON public.collections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" 
ON public.collections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Collection articles policies
CREATE POLICY "Users can view articles in their collections" 
ON public.collection_articles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE collections.id = collection_articles.collection_id 
    AND collections.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view articles in public collections" 
ON public.collection_articles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE collections.id = collection_articles.collection_id 
    AND collections.is_public = true
  )
);

CREATE POLICY "Users can add articles to their collections" 
ON public.collection_articles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE collections.id = collection_articles.collection_id 
    AND collections.user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove articles from their collections" 
ON public.collection_articles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE collections.id = collection_articles.collection_id 
    AND collections.user_id = auth.uid()
  )
);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();