import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Textarea } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useBostonQuestions } from "@/hooks/useBostonQuestions";

export function BostonQuestions() {
  const f = useBostonQuestions();
  return <section className="program-section" aria-labelledby="boston-questions-h">
    <h2 id="boston-questions-h" className="program-h2">Questions for the Boston roundtable</h2>
    <p className="program-meta">Submit a question for the speakers. Approved questions appear below without your name.</p>
    <form className="program-ask" onSubmit={(e) => { e.preventDefault(); void f.submit(); }}>
      <Field label="Your question" hint="Do not include names, contact details or other personal information." {...(f.error ? { error: f.error } : {})}>
        <Textarea value={f.question} onChange={(e) => f.setQuestion(e.target.value)} minLength={3} maxLength={500} rows={3} required disabled={f.busy} />
      </Field>
      <Checkbox checked={f.permission} onChange={f.setPermission} disabled={f.busy} label="I allow Region 17 to publish this question on the event page after review." />
      <Button size="lg" type="submit" disabled={f.busy || !f.permission || f.question.trim().length < 3}>{f.busy ? "Submitting" : "Submit question"}</Button>
    </form>
    <div role="status">{f.saved && <p>Your question is saved for review. It will appear here only if approved.</p>}</div>
    <h3 className="program-h2">Questions from guests</h3>
    {f.published.isPending ? <p role="status">Loading questions...</p> : f.published.error ? <p role="alert">Published questions are unavailable. Your submission can still be saved.</p> :
      f.published.data?.length ? <ul>{f.published.data.map((q) => <li key={q.id}>{q.question}</li>)}</ul> : <p className="program-note">No questions have been published yet.</p>}
  </section>;
}