import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOperator } from "@/lib/invest-question";
import { publicationInput, publishSelectionInput } from "@/lib/publication-review";

export const loadPublicationReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const role = await context.supabase.rpc("is_operator");
  requireOperator(role.data, Boolean(role.error));
  const result = await context.supabase.from("press_publications").select("slug,state,reviewed_at");
  if (result.error) throw new Error("Coverage review could not be loaded.");
  return result.data;
});

export const setPressPublication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => publicationInput.parse(input)).handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("is_operator");
    requireOperator(role.data, Boolean(role.error));
    const result = await context.supabase.from("press_publications").upsert({ ...data, reviewed_at: new Date().toISOString() });
    if (result.error) throw new Error("Publication state could not be saved.");
    return { saved: true };
  });

export const publishSelection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => publishSelectionInput.parse(input)).handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("is_operator");
    requireOperator(role.data, Boolean(role.error));
    const result = await context.supabase.rpc("publish_event_selection", { p_question_ids: data.questionIds, p_article_slugs: data.articleSlugs });
    if (result.error) throw new Error("The selection could not be published.");
    return { saved: true };
  });