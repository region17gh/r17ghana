import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, SectionHeader, Textarea } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useInvestQa } from "@/hooks/useInvestQa";

export function AskInvest() {
  const { answer, links, error, busy, submit, q, setQ, email, setEmail, replyPermission, setReplyPermission } = useInvestQa();
  return (
    <section className="invest-section" aria-labelledby="ask-invest-h">
      <div className="invest-wrap invest-narrow invest-stack">
      <SectionHeader eyebrow="Ask" title={<span id="ask-invest-h">Still have a question?</span>} lede="Answers come only from what this page publishes." />
      <form className="program-ask" onSubmit={(e) => { e.preventDefault(); if (q.trim().length >= 3) void submit(q); }}>
        <Field label="Your question" error={error || undefined}>
          <Textarea value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} rows={3} invalid={Boolean(error)} />
        </Field>
        <Field label="Email for a team reply (optional)"><Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} /></Field>
        <Checkbox label="The Region 17 team may email me a reply to this question." checked={replyPermission} onChange={setReplyPermission} />
        <p className="r17-cite">Your question and the automated answer are saved privately for the Region 17 team. Leave your email blank to ask without an email reply.</p>
        <Button type="submit" variant="secondary" size="lg" disabled={busy || q.trim().length < 3}>{busy ? "Thinking" : "Ask"}</Button>
      </form>
      <div aria-live="polite">{answer && <p className="program-answer">{answer}</p>}
        {links.length > 0 && (
          <ul className="invest-ask-links" aria-label="Helpful pages">
            {links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        )}</div>
      <p className="r17-cite">Automated answers can be wrong. They are not financial, legal or immigration advice.</p>
      </div>
    </section>
  );
}
