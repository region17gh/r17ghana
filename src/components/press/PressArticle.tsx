import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { PRESS_ARTICLES, pressDate, type PressArticle as Article } from "@/lib/press";
import { usePressArticleFocus } from "@/hooks/usePressArticleFocus";
import { PressShell } from "./PressShell";
import { PressVideo } from "./PressVideo";

export function PressArticle({ article }: { article: Article }) {
  const heading = usePressArticleFocus(article.slug);
  const related = PRESS_ARTICLES.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);
  return <PressShell>
    <article className="press-container press-detail">
      <nav aria-label="Breadcrumb" className="press-breadcrumb"><Link to="/{-$locale}/press" params={{ locale: undefined }}>Press archive</Link><span aria-hidden="true">/</span><span>{article.category}</span></nav>
      <header className="press-article-header"><p className="press-eyebrow">{article.publisher}</p><h1 ref={heading} tabIndex={-1}>{article.headline}</h1><p className="press-meta"><time dateTime={article.date}>{pressDate(article.date)}</time> · {article.category}</p><p className="press-lede">{article.summary}</p></header>
      {article.image && <figure className="press-article-image"><img src={article.image.url} alt={article.image.alt} /><figcaption className="press-caption">{article.image.caption}</figcaption></figure>}
      {article.videoId && <PressVideo key={article.slug} videoId={article.videoId} title={article.title} />}
      <div className="press-article-body"><p className="press-eyebrow">Coverage summary</p>{article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{article.note && <p className="press-source-note">{article.note}</p>}
        <div className="press-original"><h2>{article.publisher === "JoyNews" ? "Watch the original coverage" : "Read the original article"}</h2><p className="press-original-title">{article.title}</p><p className="press-meta">Published by {article.publisher}. Full reporting and any quoted figures remain attributed to the publisher.</p><Button href={article.url} size="lg" iconAfter="external-link">{article.publisher === "JoyNews" ? "Watch on YouTube" : "Read original article"}</Button></div>
      </div>
      <section className="press-related" aria-labelledby="related-title"><h2 id="related-title">More from the archive</h2><ul>{related.map((item) => <li key={item.slug}><p className="press-meta">{item.publisher} · {pressDate(item.date)}</p><Link to="/{-$locale}/press/$slug" params={{ locale: undefined, slug: item.slug }}>{item.headline} <span aria-hidden="true">↗</span></Link></li>)}</ul></section>
    </article>
  </PressShell>;
}