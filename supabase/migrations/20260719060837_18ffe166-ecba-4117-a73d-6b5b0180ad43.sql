
CREATE TABLE public.resume_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('hero','contact')),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.resume_downloads TO anon;
GRANT SELECT, INSERT ON public.resume_downloads TO authenticated;
GRANT ALL ON public.resume_downloads TO service_role;

ALTER TABLE public.resume_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a download"
  ON public.resume_downloads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view download logs"
  ON public.resume_downloads FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX resume_downloads_created_at_idx ON public.resume_downloads (created_at DESC);
CREATE INDEX resume_downloads_source_idx ON public.resume_downloads (source);
