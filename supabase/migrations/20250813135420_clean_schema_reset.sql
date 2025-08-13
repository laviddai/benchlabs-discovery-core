-- =====================================================
-- BenchLabs Clean Migration - Complete Schema Reset
-- =====================================================

-- 1. Categories table (create first for references)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  level_1_discipline TEXT NOT NULL,
  level_2_field TEXT NOT NULL,
  level_3_specialization TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Journals table (create second for references)
CREATE TABLE IF NOT EXISTS public.journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_name TEXT NOT NULL UNIQUE,
  parent_journal TEXT NOT NULL,
  ticker_symbol TEXT,
  rss_url TEXT NOT NULL,
  is_preprint BOOLEAN DEFAULT FALSE,
  primary_category_id TEXT REFERENCES public.categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  tag_type TEXT DEFAULT 'content',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Articles table (with foreign key references)
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  summary TEXT,
  publication_date TIMESTAMP WITH TIME ZONE,
  journal_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  journal_id UUID REFERENCES public.journals(id),
  primary_category_id TEXT REFERENCES public.categories(id),
  content_summary TEXT,
  keywords TEXT[],
  confidence_score DECIMAL(3,2) DEFAULT 1.00
);

-- 5. User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  discovery_feed_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Collections table
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Collection articles table
CREATE TABLE IF NOT EXISTS public.collection_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, article_id)
);

-- 8. User saved articles table
CREATE TABLE IF NOT EXISTS public.user_saved_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- 9. Article-Category mapping
CREATE TABLE IF NOT EXISTS public.article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.categories(id),
  assignment_type TEXT NOT NULL DEFAULT 'journal',
  confidence_score DECIMAL(3,2) DEFAULT 1.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, category_id)
);

-- 10. Article-Tag mapping
CREATE TABLE IF NOT EXISTS public.article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id),
  relevance_score DECIMAL(3,2) DEFAULT 1.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view journals" ON public.journals FOR SELECT USING (true);
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Anyone can view article categories" ON public.article_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view article tags" ON public.article_tags FOR SELECT USING (true);

CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own collections" ON public.collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public collections" ON public.collections FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage their own collections" ON public.collections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their collection articles" ON public.collection_articles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.collections WHERE collections.id = collection_articles.collection_id AND collections.user_id = auth.uid())
);
CREATE POLICY "Anyone can view public collection articles" ON public.collection_articles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.collections WHERE collections.id = collection_articles.collection_id AND collections.is_public = true)
);
CREATE POLICY "Users can manage their collection articles" ON public.collection_articles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.collections WHERE collections.id = collection_articles.collection_id AND collections.user_id = auth.uid())
);

CREATE POLICY "Users can view their saved articles" ON public.user_saved_articles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their saved articles" ON public.user_saved_articles FOR ALL USING (auth.uid() = user_id);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_articles_journal_id ON public.articles(journal_id);
CREATE INDEX IF NOT EXISTS idx_articles_primary_category ON public.articles(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON public.articles(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_article_categories_article_id ON public.article_categories(article_id);
CREATE INDEX IF NOT EXISTS idx_article_categories_category_id ON public.article_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_articles_user_id ON public.user_saved_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_articles_article_id ON public.user_saved_articles(article_id);
CREATE INDEX IF NOT EXISTS idx_journals_parent ON public.journals(parent_journal);
CREATE INDEX IF NOT EXISTS idx_journals_active ON public.journals(is_active) WHERE is_active = TRUE;