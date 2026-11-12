import { createServerFn } from "@tanstack/react-start";
import { investMaterials, pickLinks } from "@/lib/invest-materials";
import { investorQuestionInput } from "@/lib/invest-question";

const SYSTEM = `You answer prospective investor questions about Region 17 Ghana (R17GH) investment support, using ONLY the site content below.
If the content does not answer it, say "That isn't covered on this page yet." and suggest using the interest form so the team can reply.
Never give financial, legal or tax advice, never promise returns, approvals, visas or outcomes. R17GH never holds funds or sells investments.
Never advise on citizenship, Right of Abode, the Ghana Card, visas or residence; refer those to Ghana's Diaspora Affairs Office or the Ministry of the Interior.
R17GH is not a government body. Figures are estimates; cite the source given. Plain, short answers (under 90 words). No em dashes, no emoji.
After the answer, add one final line "LINKS: " followed by up to 3 comma-separated keys from PAGES that would help (for example "LINKS: form, join"), or "LINKS: none".`;

export const askInvest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => investorQuestionInput.parse(input))
  .handler(async ({ data }): Promise<{ answer: string; links: { href: string; label: string }[] } | { error: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const saved = await supabaseAdmin.rpc("capture_investor_question", { p_question: data.question, p_email: data.email || undefined, p_reply_permission: data.replyPermission });
    if (saved.error || !saved.data) return { error: "Your question could not be saved. Please try again." };
    const id = saved.data;
    try {
      const { generateChatCompletion } = await import("@lovable.dev/ai-gateway");
      const json = await generateChatCompletion({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: `${SYSTEM}\n\nSITE CONTENT\n${investMaterials()}` },
          { role: "user", content: data.question },
        ],
      });
    const content = json.choices?.[0]?.message?.content;
    const raw = typeof content === "string" ? content.trim() : "";
    const m = raw.match(/\n?LINKS:\s*(.*)$/i);
    const answer = (m ? raw.slice(0, m.index) : raw).trim();
    const keys = m ? m[1].split(",").map((k) => k.trim().toLowerCase()) : [];
    const updated = await supabaseAdmin.from("investor_questions").update({ answer: answer || null, outcome: answer ? "answered" : "unavailable" }).eq("id", id);
    if (updated.error) return { error: "Your question is saved for the team, but its answer could not be saved." };
    return answer ? { answer, links: pickLinks(keys) } : { error: "Your question is saved for the team. No automated answer came back." };
    } catch {
      await supabaseAdmin.from("investor_questions").update({ outcome: "unavailable" }).eq("id", id);
      return { error: "Your question is saved for the team. The automated helper is unavailable right now." };
    }
  });
