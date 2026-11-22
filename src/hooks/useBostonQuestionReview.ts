import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { loadBostonQuestions, reviewBostonQuestion } from "@/lib/boston-questions.functions";

export function useBostonQuestionReview() {
  const load = useServerFn(loadBostonQuestions);
  const review = useServerFn(reviewBostonQuestion);
  const cache = useQueryClient();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const query = useQuery({ queryKey: ["boston-question-review"], queryFn: () => load(), retry: false });
  async function save(id: string, state: "approved" | "rejected" | "pending") {
    if (busy) return;
    setBusy(id); setMessage("");
    try { await review({ data: { id, state } }); await cache.invalidateQueries({ queryKey: ["boston-question-review"] }); await cache.invalidateQueries({ queryKey: ["publication-review"] }); await cache.invalidateQueries({ queryKey: ["boston-published-questions"] }); setMessage("Review saved."); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Review could not be saved."); }
    finally { setBusy(""); }
  }
  return { query, busy, message, save };
}