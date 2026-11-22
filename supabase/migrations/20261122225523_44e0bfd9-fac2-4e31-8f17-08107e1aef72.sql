CREATE TABLE public.press_publications (slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','published')), reviewed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.press_publications TO anon;
GRANT SELECT, INSERT, UPDATE ON public.press_publications TO authenticated;
GRANT ALL ON public.press_publications TO service_role;
ALTER TABLE public.press_publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published coverage state" ON public.press_publications FOR SELECT TO anon USING (state='published');
CREATE POLICY "Authenticated reads published or operator coverage" ON public.press_publications FOR SELECT TO authenticated USING (state='published' OR public.is_operator());
CREATE POLICY "Operators create publication records" ON public.press_publications FOR INSERT TO authenticated WITH CHECK(public.is_operator());
CREATE POLICY "Operators update publication records" ON public.press_publications FOR UPDATE TO authenticated USING(public.is_operator()) WITH CHECK(public.is_operator());
CREATE TRIGGER press_publications_updated_at BEFORE UPDATE ON public.press_publications FOR EACH ROW EXECUTE FUNCTION public.investor_inbox_updated_at();
INSERT INTO public.press_publications(slug,state) VALUES
('washington-diplomatic-times-launch','published'),('washington-official-launch-recap','published'),('chicago-roundtable-event-record','published'),('chicago-diaspora-ownership','published'),('chicago-business-roundtable','published'),('chicago-accountability-dialogue','published'),('chicago-diaspora-concerns','published'),('region17-washington-launch-announcement','published'),('washington-diaspora-initiative','published'),('terkper-diaspora-development','published'),('gna-washington-launch','published'),('citi-washington-launch','published'),('diaspora-seventeenth-region-analysis','published'),('accra-diaspora-summit','published'),('diaspora-summit-joynews','published');
CREATE TABLE public.boston_live_questions (id uuid PRIMARY KEY, question text NOT NULL CHECK(char_length(btrim(question)) BETWEEN 3 AND 500), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.boston_live_questions TO anon,authenticated;
GRANT ALL ON public.boston_live_questions TO service_role;
ALTER TABLE public.boston_live_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors read public approved questions" ON public.boston_live_questions FOR SELECT TO anon,authenticated USING(true);
CREATE TRIGGER boston_live_questions_updated_at BEFORE UPDATE ON public.boston_live_questions FOR EACH ROW EXECUTE FUNCTION public.investor_inbox_updated_at();
CREATE FUNCTION public.sync_boston_live_question() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE qid uuid; q public.boston_questions;
BEGIN
 qid := CASE WHEN TG_TABLE_NAME='boston_questions' THEN NEW.id ELSE NEW.question_id END;
 SELECT * INTO q FROM public.boston_questions WHERE id=qid;
 IF q.state='approved' AND EXISTS(SELECT 1 FROM public.boston_question_consents c WHERE c.question_id=qid AND c.revoked_at IS NULL) AND NOT EXISTS(SELECT 1 FROM public.boston_question_consents c WHERE c.question_id=qid AND c.revoked_at IS NOT NULL) THEN
 INSERT INTO public.boston_live_questions(id,question,created_at) VALUES(q.id,q.question,q.created_at) ON CONFLICT(id) DO UPDATE SET question=excluded.question;
 ELSE
 DELETE FROM public.boston_live_questions WHERE id=qid;
 END IF;
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.sync_boston_live_question() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER sync_boston_question_live AFTER INSERT OR UPDATE ON public.boston_questions FOR EACH ROW EXECUTE FUNCTION public.sync_boston_live_question();
CREATE TRIGGER sync_boston_consent_live AFTER INSERT ON public.boston_question_consents FOR EACH ROW EXECUTE FUNCTION public.sync_boston_live_question();
INSERT INTO public.boston_live_questions(id,question,created_at) SELECT q.id,q.question,q.created_at FROM public.boston_questions q WHERE q.state='approved' AND EXISTS(SELECT 1 FROM public.boston_question_consents c WHERE c.question_id=q.id AND c.revoked_at IS NULL) AND NOT EXISTS(SELECT 1 FROM public.boston_question_consents c WHERE c.question_id=q.id AND c.revoked_at IS NOT NULL);
ALTER PUBLICATION supabase_realtime ADD TABLE public.boston_live_questions;
CREATE FUNCTION public.publish_event_selection(p_question_ids uuid[],p_article_slugs text[]) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
BEGIN
 IF NOT public.is_operator() THEN RAISE EXCEPTION 'Operator access required' USING ERRCODE='42501'; END IF;
 IF cardinality(p_question_ids)>100 OR cardinality(p_article_slugs)>100 THEN RAISE EXCEPTION 'Selection too large'; END IF;
 UPDATE public.boston_questions SET state='approved' WHERE id=ANY(p_question_ids);
 UPDATE public.press_publications SET state='published',reviewed_at=now() WHERE slug=ANY(p_article_slugs);
END; $$;
REVOKE ALL ON FUNCTION public.publish_event_selection(uuid[],text[]) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.publish_event_selection(uuid[],text[]) TO authenticated,service_role;