import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { askEvent } from "@/lib/event-qa.functions";

export function useEventQa() {
  const ask = useServerFn(askEvent);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(question: string) {
    setBusy(true); setError(""); setAnswer("");
    try {
      const r = await ask({ data: { question } });
      if ("answer" in r) setAnswer(r.answer); else setError(r.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }
  return { answer, error, busy, submit };
}
