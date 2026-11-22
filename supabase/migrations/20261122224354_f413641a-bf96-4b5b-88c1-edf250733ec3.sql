REVOKE EXECUTE ON FUNCTION public.published_boston_questions() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.published_boston_questions() TO service_role;