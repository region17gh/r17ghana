import { Button } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useInvestorInbox } from "@/hooks/useInvestorInbox";

export function InvestorInbox() {
  const f = useInvestorInbox();
  if (f.query.isPending) return <p role="status">Loading inbox…</p>;
  if (f.query.error) return <p role="alert">{f.query.error.message}</p>;
  return <div className="invest-stack">
    <Field label="Show questions"><Select value={f.filter} onChange={(e) => f.setFilter(e.target.value)}>
      <option value="all">All</option><option value="unread">Unread</option><option value="open">Open</option><option value="replied">Replied</option>
    </Select></Field>
    {f.questions.length === 0 && <p>No questions in this view.</p>}
    <ul className="invest-stack">{f.questions.map((q) => <li key={q.id}>
      <Button variant="ghost" size="lg" onClick={() => void f.open(q.id)}>{q.read_at ? "" : "Unread: "}{q.question}</Button>
      <p className="r17-cite">{new Date(q.created_at).toLocaleString()} · {q.state}</p>
    </li>)}</ul>
    {f.question && <section className="invest-stack" aria-labelledby="inbox-question-title">
      <h2 id="inbox-question-title" className="program-h2">{f.question.question}</h2>
      <p>Reply email: {f.question.reply_email || "Not provided"}</p>
      <p>Automated answer: {f.question.answer || "Unavailable"}</p>
      {f.reply ? <><p>Team reply: {f.reply.body}</p><p>Send outcome: {f.reply.outcome}</p></> : f.question.reply_email ?
        <form className="program-ask" onSubmit={(e) => { e.preventDefault(); void f.submit(); }}>
          <Field label="Your reply"><Textarea value={f.body} onChange={(e) => f.setBody(e.target.value)} rows={5} maxLength={5000} required /></Field>
          <Button type="submit" size="lg" disabled={f.busy || f.body.trim().length < 3}>{f.busy ? "Sending" : "Send reply"}</Button>
        </form> : <p>This question has no email address for a reply.</p>}
    </section>}
    <p role="status">{f.message}</p>
  </div>;
}