CREATE TABLE public.comment_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.comment_submissions TO service_role;
ALTER TABLE public.comment_submissions ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.newsletter_subscriptions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text NOT NULL UNIQUE CHECK (char_length(email) <= 255),
 consent boolean NOT NULL CHECK (consent = true),
 consent_version text NOT NULL DEFAULT 'novos-materiais-v1',
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.newsletter_subscriptions TO service_role;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;