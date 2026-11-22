import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { bostonQuestionInput } from "@/lib/boston-question";
import { publishedBostonQuestions, submitBostonQuestion } from "@/lib/boston-questions.functions";

export function useBostonQuestions() {
  const [question, setQuestion] = useState("");
  const [permission, setPermission] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const send = useServerFn(submitBostonQuestion);
  const read = useServerFn(publishedBostonQuestions);
  const published = useQuery({ queryKey: ["boston-published-questions"], queryFn: () => read(), refetchInterval: 60_000, retry: false });
  async function submit() {
    if (busy) return;
    const parsed = bostonQuestionInput.safeParse({ question, publicationPermission: permission });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check your question."); return; }
    setBusy(true); setError(""); setSaved(false);
    try { await send({ data: parsed.data }); setSaved(true); setQuestion(""); setPermission(false); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not save your question."); }
    finally { setBusy(false); }
  }
  return { question, setQuestion, permission, setPermission, busy, error, saved, published, submit };
}