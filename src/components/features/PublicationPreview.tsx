import { Link } from "@tanstack/react-router";
import { PressArticleContent } from "@/components/press/PressArticleContent";
import { GuestQuestions } from "@/components/program/GuestQuestions";
import { type PressArticle } from "@/lib/press";
import { previewQuestions } from "@/lib/publication-preview";

interface Props {
  article: PressArticle | undefined;
  selectedQuestions: { id: string; question: string }[];
  liveQuestions: { id: string; question: string }[];
}
export function PublicationPreview({ article, selectedQuestions, liveQuestions }: Props) {
  return <section className="program-section" aria-label="Publication preview">
    <h2 className="program-h2">Live page preview</h2>
    <p className="program-meta">Selected questions are shown below as they will appear after publishing. This preview does not make them public.</p>
    {article && <article className="press-detail"><PressArticleContent article={article} /></article>}
    {selectedQuestions.length > 0 && <><h3 className="program-h2">Selected questions (not yet published)</h3>
      <ul>{selectedQuestions.map((q) => <li key={q.id}>{q.question}</li>)}</ul></>}
    <section className="program-section" aria-label="Boston event question preview"><h2 className="program-h2">Questions for the Boston roundtable</h2>
      <GuestQuestions questions={previewQuestions(liveQuestions, selectedQuestions)} />
    </section>
    <div className="program-links">
      <Link to="/{-$locale}/events/roundtables/boston" params={{ locale: undefined }} target="_blank" rel="noopener noreferrer">Open public Boston page ↗</Link>
      <Link to="/{-$locale}/press" params={{ locale: undefined }} target="_blank" rel="noopener noreferrer">Open public press archive ↗</Link>
    </div>
  </section>;
}