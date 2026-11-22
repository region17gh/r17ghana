import { Link } from "@tanstack/react-router";
import { Checkbox, Badge } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { Button } from "@/components/ui/Button";
import { usePublicationReview } from "@/hooks/usePublicationReview";
import { BostonQuestionReview } from "@/components/features/BostonQuestionReview";
import { PublicationPreview } from "@/components/features/PublicationPreview";

export function PublicationReview() {
  const f = usePublicationReview();
  if (f.query.isPending) return <p role="status">Loading publication panel...</p>;
  if (f.query.error) return <div role="alert"><p>{f.query.error.message}</p><p>This account needs platform-operator permission to access publishing.</p><Link to="/admin">Team sign in</Link></div>;
  return <>
    <section className="program-section"><h2 className="program-h2">Publish together</h2>
      <div className="publication-columns"><div><h3 className="program-h2">Pending questions</h3>
        {f.query.data?.questions.filter((q) => q.state === "pending").map((q) => <div className="publication-choice" key={q.id}><Checkbox label={q.question} checked={f.questionIds.includes(q.id)} onChange={() => f.toggle(q.id, "question")} /></div>)}
      </div><div><h3 className="program-h2">Draft coverage</h3>
        {f.articles.filter((a) => a.state === "draft").map((a) => <div className="publication-choice" key={a.slug}><Checkbox label={a.headline} checked={f.articleSlugs.includes(a.slug)} onChange={() => f.toggle(a.slug, "article")} /></div>)}
        {!f.articles.some((a) => a.state === "draft") && <p>No draft coverage.</p>}
      </div></div>
      <Button size="lg" disabled={f.busy || !(f.questionIds.length + f.articleSlugs.length)} onClick={() => void f.save()}>Publish selected questions and coverage</Button>
      <p role="status">{f.message}</p>
    </section>
    <PublicationPreview article={f.articles.find((a) => a.slug === f.previewSlug)} selectedQuestions={f.query.data?.questions.filter((q) => f.questionIds.includes(q.id)) ?? []} liveQuestions={f.live.data ?? []} />
    <section className="program-section"><h2 className="program-h2">Coverage</h2>{f.articles.map((a) => <article className="publication-row" key={a.slug}>
      <div><Badge>{a.state}</Badge><h3 className="program-h2">{a.headline}</h3><p className="program-meta">{a.publisher}</p>
        <div className="program-links"><Button variant="ghost" size="lg" onClick={() => f.setPreviewSlug(a.slug)}>Preview coverage</Button>
        {a.state === "published" && <Link to="/{-$locale}/press/$slug" params={{ locale: undefined, slug: a.slug }}>Open coverage page</Link>}</div></div>
      <Button size="lg" variant="secondary" disabled={f.busy} onClick={() => void f.save(a.slug, a.state === "published" ? "draft" : "published")}>{a.state === "published" ? "Unpublish" : "Publish"}</Button>
    </article>)}</section>
    <section className="program-section"><h2 className="program-h2">Review Boston questions</h2><BostonQuestionReview /></section>
  </>;
}