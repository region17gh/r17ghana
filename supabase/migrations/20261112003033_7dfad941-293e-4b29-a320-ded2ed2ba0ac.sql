CREATE TABLE public.investor_questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 question text NOT NULL CHECK (char_length(question) BETWEEN 3 AND 500), reply_email text CHECK (reply_email IS NULL OR char_length(reply_email) <= 254),
 answer text, outcome text NOT NULL DEFAULT 'pending' CHECK (outcome IN ('pending','answered','unavailable')), read_at timestamptz, state text NOT NULL DEFAULT 'open' CHECK (state IN ('open','replied'))
);
GRANT SELECT ON public.investor_questions TO authenticated;
GRANT ALL ON public.investor_questions TO service_role;
ALTER TABLE public.investor_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read investor questions" ON public.investor_questions FOR SELECT TO authenticated USING (public.is_operator());
CREATE INDEX investor_questions_newest ON public.investor_questions(created_at DESC);
CREATE TABLE public.investor_question_consents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), question_id uuid NOT NULL REFERENCES public.investor_questions(id),
 granted_at timestamptz NOT NULL DEFAULT now(), revoked_at timestamptz, policy_version text NOT NULL, mechanism text NOT NULL
);
GRANT SELECT ON public.investor_question_consents TO authenticated;
GRANT SELECT, INSERT ON public.investor_question_consents TO service_role;
ALTER TABLE public.investor_question_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read question consent" ON public.investor_question_consents FOR SELECT TO authenticated USING (public.is_operator());
CREATE TABLE public.investor_question_replies (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), question_id uuid NOT NULL UNIQUE REFERENCES public.investor_questions(id), administrator_id uuid NOT NULL REFERENCES auth.users(id),
 body text NOT NULL CHECK (char_length(body) BETWEEN 3 AND 5000), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 outcome text NOT NULL DEFAULT 'sending' CHECK (outcome IN ('sending','sent','suppressed','failed','unknown'))
);
GRANT SELECT ON public.investor_question_replies TO authenticated;
GRANT ALL ON public.investor_question_replies TO service_role;
ALTER TABLE public.investor_question_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read question replies" ON public.investor_question_replies FOR SELECT TO authenticated USING (public.is_operator());
CREATE FUNCTION public.question_consent_append_only() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$ BEGIN RAISE EXCEPTION 'Question consents are append-only'; END; $$;
CREATE TRIGGER question_consent_append_only BEFORE UPDATE OR DELETE ON public.investor_question_consents FOR EACH ROW EXECUTE FUNCTION public.question_consent_append_only();
CREATE FUNCTION public.investor_inbox_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER investor_questions_updated_at BEFORE UPDATE ON public.investor_questions FOR EACH ROW EXECUTE FUNCTION public.investor_inbox_updated_at();
CREATE TRIGGER investor_replies_updated_at BEFORE UPDATE ON public.investor_question_replies FOR EACH ROW EXECUTE FUNCTION public.investor_inbox_updated_at();
CREATE FUNCTION public.capture_investor_question(p_question text, p_email text DEFAULT NULL, p_reply_permission boolean DEFAULT false) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE qid uuid; BEGIN
 IF char_length(btrim(p_question)) NOT BETWEEN 3 AND 500 THEN RAISE EXCEPTION 'Invalid question'; END IF;
 IF p_email IS NOT NULL AND (NOT p_reply_permission OR p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR char_length(p_email)>254) THEN RAISE EXCEPTION 'Reply email requires permission and a valid address'; END IF;
 INSERT INTO public.investor_questions(question,reply_email) VALUES(btrim(p_question),nullif(lower(btrim(p_email)),'')) RETURNING id INTO qid;
 IF p_email IS NOT NULL THEN INSERT INTO public.investor_question_consents(question_id,policy_version,mechanism) VALUES(qid,'investor-reply-v1','unchecked-checkbox'); END IF;
 RETURN qid;
END; $$;
REVOKE ALL ON FUNCTION public.capture_investor_question(text,text,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.capture_investor_question(text,text,boolean) TO service_role;