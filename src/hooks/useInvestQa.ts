import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { askInvest } from "@/lib/invest-qa.functions";

export type QaLink = { href: string; label: string };

export function useInvestQa() {
  const ask = useServerFn(askInvest);
  const [answer, setAnswer] = useState("");
  const [links, setLinks] = useState<QaLink[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(question: string) {
    setBusy(true); setError(""); setAnswer(""); setLinks([]);
    let result: "answered" | "unavailable" = "unavailable";
    try {
      const r = await ask({ data: { question } });
      if ("answer" in r) { setAnswer(r.answer); setLinks(r.links); result = "answered"; } else setError(r.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      // Counts only the outcome; the question text is never sent.
      window.__lovableEvents?.track?.("project.investor_question_asked", { result });
    }
  }
  return { answer, links, error, busy, submit };
}
