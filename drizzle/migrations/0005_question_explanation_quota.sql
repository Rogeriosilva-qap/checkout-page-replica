CREATE TABLE public.question_explanation_usage (
 email text PRIMARY KEY,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.question_explanation_usage TO service_role;
ALTER TABLE public.question_explanation_usage ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.claim_question_explanation(p_lead_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE claimed_email text;
BEGIN
 INSERT INTO public.question_explanation_usage (email)
 SELECT lower(trim(email)) FROM public.question_leads WHERE id = p_lead_id
 ON CONFLICT (email) DO NOTHING
 RETURNING email INTO claimed_email;
 RETURN claimed_email IS NOT NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_question_explanation(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_question_explanation(uuid) TO service_role;