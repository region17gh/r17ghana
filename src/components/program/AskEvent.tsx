import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useEventQa } from "@/hooks/useEventQa";

export function AskEvent() {
  const [q, setQ] = useState("");
  const { answer, error, busy, submit } = useEventQa();
  return (
    <section className="program-section" aria-labelledby="ask-h">
      <h2 id="ask-h" className="program-h2">Ask about the event</h2>
      <p className="program-meta">Answers come only from the speakers, run of show and video list on this page.</p>
      <form className="program-ask" onSubmit={(e) => { e.preventDefault(); if (q.trim().length >= 3) void submit(q); }}>
        <Field label="Your question" error={error || undefined}>
          <Textarea value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} rows={3} invalid={Boolean(error)} />
        </Field>
        <Button type="submit" variant="primary" size="lg" disabled={busy || q.trim().length < 3}>{busy ? "Thinking" : "Ask"}</Button>
      </form>
      <div aria-live="polite">{answer && <p className="program-answer">{answer}</p>}</div>
      <p className="r17-cite program-note">Automated answers can be wrong. They are not advice on citizenship, visas or residence.</p>
    </section>
  );
}
