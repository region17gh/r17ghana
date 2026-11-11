import { createServerFn } from "@tanstack/react-start";
import { investMaterials, pickLinks } from "@/lib/invest-materials";

const SYSTEM = `You answer prospective investor questions about Region 17 Ghana (R17GH) investment support, using ONLY the site content below.
If the content does not answer it, say "That isn't covered on this page yet." and suggest using the interest form so the team can reply.
Never give financial, legal or tax advice, never promise returns, approvals, visas or outcomes. R17GH never holds funds or sells investments.
Never advise on citizenship, Right of Abode, the Ghana Card, visas or residence; refer those to Ghana's Diaspora Affairs Office or the Ministry of the Interior.
R17GH is not a government body. Figures are estimates; cite the source given. Plain, short answers (under 90 words). No em dashes, no emoji.
After the answer, add one final line "LINKS: " followed by up to 3 comma-separated keys from PAGES that would help (for example "LINKS: form, join"), or "LINKS: none".`;

export const askInvest = createServerFn({ method: "POST" })
  .inputValidator((input: { question: string }) => {
    const q = typeof input?.question === "string" ? input.question.trim() : "";
    if (q.length < 3 || q.length > 500) throw new Error("Please ask a question between 3 and 500 characters.");
    return { question: q };
  })
  .handler(async ({ data }): Promise<{ answer: string; links: { href: string; label: string }[] } | { error: string }> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { error: "The question helper isn't available right now." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `${SYSTEM}\n\nSITE CONTENT\n${investMaterials()}` },
          { role: "user", content: data.question },
        ],
      }),
    });
    if (!res.ok) {
      console.error(`AI gateway failed [${res.status}]`);
      if (res.status === 429) return { error: "Lots of questions right now. Please try again in a minute." };
      return { error: "The question helper isn't available right now. Please use the form below." };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = json.choices?.[0]?.message?.content?.trim() ?? "";
    const m = raw.match(/\n?LINKS:\s*(.*)$/i);
    const answer = (m ? raw.slice(0, m.index) : raw).trim();
    const keys = m ? m[1].split(",").map((k) => k.trim().toLowerCase()) : [];
    return answer ? { answer, links: pickLinks(keys) } : { error: "No answer came back. Please try again." };
  });
