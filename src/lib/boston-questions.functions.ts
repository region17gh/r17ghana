import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { bostonQuestionInput, bostonReviewInput } from "@/lib/boston-question";
import { requireOperator } from "@/lib/invest-question";

export const publishedBostonQuestions = createServerFn({ method: "GET" }).handler(async () => {
  // This server-only projection cannot return pending text, consents or identities.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const result = await supabaseAdmin.rpc("published_boston_questions");
  if (result.error) throw new Error("Published questions could not be loaded.");
  return result.data;
});

export const submitBostonQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bostonQuestionInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result = await supabaseAdmin.rpc("capture_boston_question", {
      p_question: data.question, p_publication_permission: data.publicationPermission,
    });
    if (result.error) throw new Error("Your question could not be saved. Please try again.");
    return { saved: true };
  });

export const loadBostonQuestions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await context.supabase.rpc("is_operator");
    requireOperator(role.data, Boolean(role.error));
    const result = await context.supabase.from("boston_questions").select("id,question,state,created_at").order("created_at", { ascending: false }).limit(200);
    if (result.error) throw new Error("Questions could not be loaded.");
    return result.data;
  });

export const reviewBostonQuestion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => bostonReviewInput.parse(input))
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("is_operator");
    requireOperator(role.data, Boolean(role.error));
    const result = await context.supabase.from("boston_questions").update({ state: data.state }).eq("id", data.id).select("id").single();
    if (result.error) throw new Error("The review could not be saved.");
    return { saved: true };
  });