-- Create UserPreference table
CREATE TABLE public.user_preferences (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  discovery_feed_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Article table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  summary TEXT,
  publication_date TIMESTAMP WITH TIME ZONE,
  journal_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Category table
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  level_1_discipline TEXT NOT NULL,
  level_2_field TEXT NOT NULL,
  level_3_specialization TEXT,
  level_4_subspecialization TEXT,
  description TEXT
);

-- Create Tag table  
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Create ArticleCategoryMap table (many-to-many)
CREATE TABLE public.article_category_maps (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

-- Create ArticleTagMap table (many-to-many)
CREATE TABLE public.article_tag_maps (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_category_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tag_maps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for articles (public read access)
CREATE POLICY "Anyone can view articles" 
ON public.articles 
FOR SELECT 
USING (true);

-- RLS Policies for categories (public read access)
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

-- RLS Policies for tags (public read access)
CREATE POLICY "Anyone can view tags" 
ON public.tags 
FOR SELECT 
USING (true);

-- RLS Policies for article_category_maps (public read access)
CREATE POLICY "Anyone can view article category mappings" 
ON public.article_category_maps 
FOR SELECT 
USING (true);

-- RLS Policies for article_tag_maps (public read access)
CREATE POLICY "Anyone can view article tag mappings" 
ON public.article_tag_maps 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_preferences timestamps
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user preferences when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample categories
INSERT INTO public.categories (id, level_1_discipline, level_2_field, level_3_specialization, level_4_subspecialization, description) VALUES
('BIO-MOL-GEN-01', 'Biology', 'Molecular Biology', 'Genetics', 'Gene Editing', 'Research focused on genetic modification techniques'),
('BIO-MOL-PRO-01', 'Biology', 'Molecular Biology', 'Proteomics', 'Protein Structure', 'Studies of protein folding and structure'),
('CHE-ORG-SYN-01', 'Chemistry', 'Organic Chemistry', 'Synthesis', 'Drug Discovery', 'Organic synthesis for pharmaceutical applications'),
('PHY-QUA-MEC-01', 'Physics', 'Quantum Physics', 'Mechanics', 'Quantum Computing', 'Quantum mechanical principles in computing'),
('MED-ONC-IMM-01', 'Medicine', 'Oncology', 'Immunotherapy', 'CAR-T Therapy', 'Cellular immunotherapy for cancer treatment');

-- Insert sample tags
INSERT INTO public.tags (name) VALUES
('crispr_cas9'),
('protein_folding'),
('drug_discovery'),
('quantum_computing'),
('immunotherapy'),
('cancer_research'),
('machine_learning'),
('artificial_intelligence'),
('biomarkers'),
('clinical_trials');

-- Insert sample articles
INSERT INTO public.articles (title, link, summary, publication_date, journal_name) VALUES
('CRISPR-Cas9 Advances in Gene Therapy', 'https://example.com/crispr-advances', 'Recent breakthroughs in CRISPR technology for treating genetic disorders.', '2024-01-15 10:00:00+00', 'Nature Biotechnology'),
('Protein Folding Mechanisms Revealed', 'https://example.com/protein-folding', 'New insights into how proteins achieve their functional conformations.', '2024-01-14 14:30:00+00', 'Science'),
('Quantum Computing in Drug Discovery', 'https://example.com/quantum-drugs', 'Applications of quantum algorithms in pharmaceutical research.', '2024-01-13 09:15:00+00', 'Nature Quantum Information'),
('CAR-T Cell Therapy Updates', 'https://example.com/cart-therapy', 'Latest developments in chimeric antigen receptor T-cell treatments.', '2024-01-12 16:45:00+00', 'Cell'),
('AI in Biomarker Discovery', 'https://example.com/ai-biomarkers', 'Machine learning approaches to identifying disease biomarkers.', '2024-01-11 11:20:00+00', 'Nature Medicine');

-- Create article-category mappings
INSERT INTO public.article_category_maps (article_id, category_id) VALUES
((SELECT id FROM public.articles WHERE title = 'CRISPR-Cas9 Advances in Gene Therapy'), 'BIO-MOL-GEN-01'),
((SELECT id FROM public.articles WHERE title = 'Protein Folding Mechanisms Revealed'), 'BIO-MOL-PRO-01'),
((SELECT id FROM public.articles WHERE title = 'Quantum Computing in Drug Discovery'), 'PHY-QUA-MEC-01'),
((SELECT id FROM public.articles WHERE title = 'Quantum Computing in Drug Discovery'), 'CHE-ORG-SYN-01'),
((SELECT id FROM public.articles WHERE title = 'CAR-T Cell Therapy Updates'), 'MED-ONC-IMM-01'),
((SELECT id FROM public.articles WHERE title = 'AI in Biomarker Discovery'), 'MED-ONC-IMM-01');

-- Create article-tag mappings
INSERT INTO public.article_tag_maps (article_id, tag_id) VALUES
((SELECT id FROM public.articles WHERE title = 'CRISPR-Cas9 Advances in Gene Therapy'), (SELECT id FROM public.tags WHERE name = 'crispr_cas9')),
((SELECT id FROM public.articles WHERE title = 'Protein Folding Mechanisms Revealed'), (SELECT id FROM public.tags WHERE name = 'protein_folding')),
((SELECT id FROM public.articles WHERE title = 'Quantum Computing in Drug Discovery'), (SELECT id FROM public.tags WHERE name = 'quantum_computing')),
((SELECT id FROM public.articles WHERE title = 'Quantum Computing in Drug Discovery'), (SELECT id FROM public.tags WHERE name = 'drug_discovery')),
((SELECT id FROM public.articles WHERE title = 'CAR-T Cell Therapy Updates'), (SELECT id FROM public.tags WHERE name = 'immunotherapy')),
((SELECT id FROM public.articles WHERE title = 'CAR-T Cell Therapy Updates'), (SELECT id FROM public.tags WHERE name = 'cancer_research')),
((SELECT id FROM public.articles WHERE title = 'AI in Biomarker Discovery'), (SELECT id FROM public.tags WHERE name = 'machine_learning')),
((SELECT id FROM public.articles WHERE title = 'AI in Biomarker Discovery'), (SELECT id FROM public.tags WHERE name = 'biomarkers'));