CREATE TABLE public.question_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  marketing_consent boolean NOT NULL DEFAULT false,
  consent_version text NOT NULL DEFAULT 'explicar-questao-v1',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.question_leads TO service_role;
ALTER TABLE public.question_leads ENABLE ROW LEVEL SECURITY;