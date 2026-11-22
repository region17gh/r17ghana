import { Button } from "@/components/ui/Button";
import { useBostonQuestionReview } from "@/hooks/useBostonQuestionReview";

export function BostonQuestionReview() {
  const f = useBostonQuestionReview();
  if (f.query.isPending) return <p role="status">Loading questions...</p>;
  if (f.query.error) return <p role="alert">{f.query.error.message}</p>;
  return <div className="invest-stack">
    {!f.query.data?.length && <p>No Boston questions yet.</p>}
    {f.query.data?.map((q) => <article className="program-section" key={q.id}>
      <h2 className="program-h2">{q.question}</h2><p className="program-meta">{q.state}</p>
      <div className="program-links">
        <Button size="lg" onClick={() => void f.save(q.id, "approved")} disabled={Boolean(f.busy) || q.state === "approved"}>Approve</Button>
        <Button size="lg" variant="secondary" onClick={() => void f.save(q.id, "rejected")} disabled={Boolean(f.busy) || q.state === "rejected"}>Reject</Button>
        {q.state !== "pending" && <Button size="lg" variant="ghost" onClick={() => void f.save(q.id, "pending")} disabled={Boolean(f.busy)}>Return to review</Button>}
      </div>
    </article>)}
    <p role="status">{f.message}</p>
  </div>;
}