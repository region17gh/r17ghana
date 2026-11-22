CREATE TABLE public.boston_questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), question text NOT NULL CHECK (char_length(btrim(question)) BETWEEN 3 AND 500),
 state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','approved','rejected')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.boston_questions TO authenticated;
GRANT ALL ON public.boston_questions TO service_role;
ALTER TABLE public.boston_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read Boston questions" ON public.boston_questions FOR SELECT TO authenticated USING (public.is_operator());
CREATE POLICY "Operators review Boston questions" ON public.boston_questions FOR UPDATE TO authenticated USING (public.is_operator()) WITH CHECK (public.is_operator());
CREATE INDEX boston_questions_state_date ON public.boston_questions(state, created_at DESC);
CREATE TRIGGER boston_questions_updated_at BEFORE UPDATE ON public.boston_questions FOR EACH ROW EXECUTE FUNCTION public.investor_inbox_updated_at();
CREATE TABLE public.boston_question_consents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), question_id uuid NOT NULL REFERENCES public.boston_questions(id),
 granted_at timestamptz NOT NULL DEFAULT now(), revoked_at timestamptz, policy_version text NOT NULL, mechanism text NOT NULL
);
GRANT SELECT ON public.boston_question_consents TO authenticated;
GRANT SELECT, INSERT ON public.boston_question_consents TO service_role;
ALTER TABLE public.boston_question_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read Boston publication consent" ON public.boston_question_consents FOR SELECT TO authenticated USING (public.is_operator());
CREATE INDEX boston_question_consent_question ON public.boston_question_consents(question_id);
CREATE TRIGGER boston_consent_append_only BEFORE UPDATE OR DELETE ON public.boston_question_consents FOR EACH ROW EXECUTE FUNCTION public.question_consent_append_only();
CREATE FUNCTION public.capture_boston_question(p_question text, p_publication_permission boolean) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE qid uuid;
BEGIN
 IF p_question IS NULL OR char_length(btrim(p_question)) NOT BETWEEN 3 AND 500 OR p_publication_permission IS DISTINCT FROM true THEN RAISE EXCEPTION 'A valid question and publication permission are required'; END IF;
 INSERT INTO public.boston_questions(question) VALUES(btrim(p_question)) RETURNING id INTO qid;
 INSERT INTO public.boston_question_consents(question_id,policy_version,mechanism) VALUES(qid,'boston-public-question-v1','affirmative-unchecked-checkbox');
 RETURN qid;
END; $$;
REVOKE ALL ON FUNCTION public.capture_boston_question(text,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.capture_boston_question(text,boolean) TO service_role;
CREATE FUNCTION public.published_boston_questions() RETURNS TABLE(id uuid,question text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT q.id,q.question FROM public.boston_questions q WHERE q.state='approved' AND
 EXISTS (SELECT 1 FROM public.boston_question_consents c WHERE c.question_id=q.id AND c.revoked_at IS NULL) AND
 NOT EXISTS (SELECT 1 FROM public.boston_question_consents c WHERE c.question_id=q.id AND c.revoked_at IS NOT NULL)
 ORDER BY q.created_at DESC LIMIT 100;
$$;
REVOKE ALL ON FUNCTION public.published_boston_questions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.published_boston_questions() TO anon, authenticated, service_role;