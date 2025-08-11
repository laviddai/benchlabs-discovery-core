-- Create user_saved_articles table
CREATE TABLE public.user_saved_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_saved_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved articles" 
ON public.user_saved_articles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save articles" 
ON public.user_saved_articles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved articles" 
ON public.user_saved_articles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_saved_articles_user_id ON public.user_saved_articles(user_id);
CREATE INDEX idx_user_saved_articles_article_id ON public.user_saved_articles(article_id);