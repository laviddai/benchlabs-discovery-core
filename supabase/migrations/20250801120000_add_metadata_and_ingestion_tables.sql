-- Create journal_metadata table
CREATE TABLE public.journal_metadata (
  id SERIAL PRIMARY KEY,
  journal_name TEXT NOT NULL UNIQUE,
  ticker_symbol TEXT UNIQUE,
  website_url TEXT
);
ALTER TABLE public.journal_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view journal metadata" ON public.journal_metadata FOR SELECT USING (true);

-- Create ingestion_sources table
CREATE TABLE public.ingestion_sources (
  id SERIAL PRIMARY KEY,
  category_id TEXT REFERENCES public.categories(id),
  tags TEXT,
  source_name TEXT,
  access_url TEXT NOT NULL,
  ticker_symbol TEXT
);
ALTER TABLE public.ingestion_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view ingestion sources" ON public.ingestion_sources FOR SELECT USING (true);

-- Create ingestion_logs table
CREATE TABLE public.ingestion_logs (
  id SERIAL PRIMARY KEY,
  source_url TEXT,
  category_id TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.ingestion_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view logs" ON public.ingestion_logs FOR SELECT USING (true);