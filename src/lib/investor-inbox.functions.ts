import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { replyInput, requireOperator } from "@/lib/invest-question";

export const loadInvestorInbox = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await context.supabase.rpc("is_operator");
    requireOperator(role.data, Boolean(role.error));
    const questions = await context.supabase.from("investor_questions").select("*").order("created_at", { ascending: false }).limit(200);
    const replies = await context.supabase.from("investor_question_replies").select("*");
    if (questions.error || replies.error) throw new Error("The inbox could not be loaded.");
    return { questions: questions.data, replies: replies.data };
  });

export const markInvestorQuestionRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("is_operator");
    requireOperator(role.data, Boolean(role.error));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result = await supabaseAdmin.from("investor_questions").update({ read_at: new Date().toISOString() }).eq("id", data.id).is("read_at", null);
    if (result.error) throw new Error("Could not mark this question read.");
    return { ok: true };
  });

export const replyToInvestorQuestion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => replyInput.parse(input))
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("is_operator");
    requireOperator(role.data, Boolean(role.error));
    const question = await context.supabase.from("investor_questions").select("id,question,reply_email").eq("id", data.id).single();
    const consent = await context.supabase.from("investor_question_consents").select("id,revoked_at").eq("question_id", data.id).order("granted_at", { ascending: false }).limit(1).maybeSingle();
    if (question.error || consent.error || !question.data.reply_email || !consent.data || consent.data.revoked_at) throw new Error("This guest has not allowed an email reply.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const claim = await supabaseAdmin.from("investor_question_replies").insert({ question_id: data.id, administrator_id: context.userId, body: data.body }).select("id").single();
    if (claim.error) throw new Error("A reply already exists or is sending. Refresh the inbox before proceeding.");
    let outcome: "sent" | "suppressed" | "unknown";
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      const result = await sendTemplateEmail("investor-reply", question.data.reply_email, { templateData: { question: question.data.question, reply: data.body }, idempotencyKey: `investor-reply:${claim.data.id}` });
      outcome = result.sent ? "sent" : "suppressed";
    } catch {
      outcome = "unknown";
    }
    const saved = await supabaseAdmin.from("investor_question_replies").update({ outcome }).eq("id", claim.data.id);
    if (saved.error) throw new Error("The reply outcome could not be saved. Do not send again until delivery is checked.");
    if (outcome === "sent") await supabaseAdmin.from("investor_questions").update({ state: "replied" }).eq("id", data.id);
    return { outcome };
  });