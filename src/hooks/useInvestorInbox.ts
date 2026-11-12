import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { loadInvestorInbox, markInvestorQuestionRead, replyToInvestorQuestion } from "@/lib/investor-inbox.functions";

export function useInvestorInbox() {
  const load = useServerFn(loadInvestorInbox);
  const mark = useServerFn(markInvestorQuestionRead);
  const send = useServerFn(replyToInvestorQuestion);
  const cache = useQueryClient();
  const query = useQuery({ queryKey: ["investor-inbox"], queryFn: () => load(), retry: false });
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const questions = query.data?.questions.filter((q) => filter === "all" || (filter === "unread" ? !q.read_at : q.state === filter)) ?? [];
  const question = query.data?.questions.find((q) => q.id === selected);
  const reply = query.data?.replies.find((r) => r.question_id === selected);
  async function open(id: string) {
    setSelected(id); setBody(""); setMessage("");
    try { await mark({ data: { id } }); await cache.invalidateQueries({ queryKey: ["investor-inbox"] }); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Could not open question."); }
  }
  async function submit() {
    if (!question || busy) return;
    setBusy(true); setMessage("");
    try {
      const r = await send({ data: { id: question.id, body } });
      setMessage(r.outcome === "sent" ? "Reply sent." : r.outcome === "suppressed" ? "This recipient cannot receive app emails." : "Delivery is unconfirmed. Check email activity before any further action.");
      await cache.invalidateQueries({ queryKey: ["investor-inbox"] });
    } catch (e) { setMessage(e instanceof Error ? e.message : "Reply could not be sent."); }
    finally { setBusy(false); }
  }
  return { query, questions, question, reply, filter, setFilter, body, setBody, busy, message, open, submit };
}