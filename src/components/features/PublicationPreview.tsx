import { Link } from "@tanstack/react-router";
import { PressVideo } from "@/components/press/PressVideo";
import { type PressArticle, pressDate } from "@/lib/press";

interface Props {
  article: PressArticle | undefined;
  selectedQuestions: { id: string; question: string }[];
  liveQuestions: { id: string; question: string }[];
}
export function PublicationPreview({ article, selectedQuestions, liveQuestions }: Props) {
  return <section className="program-section" aria-label="Publication preview">
    <h2 className="program-h2">Preview</h2>
    {article && <article className="press-article-body">
      <p className="program-meta">{article.publisher} · {pressDate(article.date)}</p>
      <h3 className="program-h2">{article.headline}</h3>
      <p>{article.summary}</p>
      {article.videoId && <PressVideo videoId={article.videoId} title={article.title} />}
      {article.paragraphs.map((text) => <p key={text}>{text}</p>)}
    </article>}
    {selectedQuestions.length > 0 && <><h3 className="program-h2">Selected questions (not yet published)</h3>
      <ul>{selectedQuestions.map((q) => <li key={q.id}>{q.question}</li>)}</ul></>}
    <h3 className="program-h2">Live Boston questions</h3>
    <div aria-live="polite">{liveQuestions.length ? <ul>{liveQuestions.map((q) => <li key={q.id}>{q.question}</li>)}</ul> : <p>No public questions yet.</p>}</div>
    <div className="program-links">
      <Link to="/{-$locale}/events/roundtables/boston" params={{ locale: undefined }} target="_blank" rel="noopener noreferrer">Open public Boston page ↗</Link>
      <Link to="/{-$locale}/press" params={{ locale: undefined }} target="_blank" rel="noopener noreferrer">Open public press archive ↗</Link>
    </div>
  </section>;
}