import { createServerFn } from "@tanstack/react-start";
import { eventMaterials } from "@/lib/event-materials";

const SYSTEM = `You answer guest questions about one Region 17 Ghana event, using ONLY the event materials below.
Rules: If the materials do not contain the answer, say "That isn't in the published event materials." and suggest asking the organisers.
You cannot watch the videos; only their titles and lengths are known. Never invent what a video says.
Never advise on citizenship, Right of Abode, the Ghana Card, visas or residence; refer those to Ghana's Diaspora Affairs Office or the Ministry of the Interior.
Region 17 is not a government body. Plain, short answers (under 90 words). No em dashes, no emoji, no payments.`;

export const askEvent = createServerFn({ method: "POST" })
  .inputValidator((input: { question: string }) => {
    const q = typeof input?.question === "string" ? input.question.trim() : "";
    if (q.length < 3 || q.length > 500) throw new Error("Please ask a question between 3 and 500 characters.");
    return { question: q };
  })
  .handler(async ({ data }): Promise<{ answer: string } | { error: string }> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { error: "The question helper isn't available right now." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: `${SYSTEM}\n\nEVENT MATERIALS\n${eventMaterials()}` },
          { role: "user", content: data.question },
        ],
      }),
    });
    if (!res.ok) {
      console.error(`AI gateway failed [${res.status}]: ${await res.text()}`);
      if (res.status === 429) return { error: "Lots of questions right now. Please try again in a minute." };
      return { error: "The question helper isn't available right now. Please try again later." };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const answer = json.choices?.[0]?.message?.content?.trim();
    return answer ? { answer } : { error: "No answer came back. Please try again." };
  });
