CREATE OR REPLACE FUNCTION public.sync_boston_live_question() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE qid uuid; q public.boston_questions;
BEGIN
 qid := CASE WHEN TG_TABLE_NAME='boston_questions' THEN (to_jsonb(NEW)->>'id')::uuid ELSE (to_jsonb(NEW)->>'question_id')::uuid END;
 SELECT * INTO q FROM public.boston_questions WHERE id=qid;
 IF q.state='approved' AND EXISTS(SELECT 1 FROM public.boston_question_consents c WHERE c.question_id=qid AND c.revoked_at IS NULL) AND NOT EXISTS(SELECT 1 FROM public.boston_question_consents c WHERE c.question_id=qid AND c.revoked_at IS NOT NULL) THEN
 INSERT INTO public.boston_live_questions(id,question,created_at) VALUES(q.id,q.question,q.created_at) ON CONFLICT(id) DO UPDATE SET question=excluded.question;
 ELSE
 DELETE FROM public.boston_live_questions WHERE id=qid;
 END IF;
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.sync_boston_live_question() FROM PUBLIC,anon,authenticated;