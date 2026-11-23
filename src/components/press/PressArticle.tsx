import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { pressDate, type PressArticle as Article } from "@/lib/press";
import { usePressArticleFocus } from "@/hooks/usePressArticleFocus";
import { PressShell } from "./PressShell";
import { PressArticleContent } from "./PressArticleContent";

export function PressArticle({ article, catalog }: { article: Article; catalog: Article[] }) {
  const heading = usePressArticleFocus(article.slug);
  const related = catalog.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);
  return <PressShell>
    <article className="press-container press-detail">
      <nav aria-label="Breadcrumb" className="press-breadcrumb"><Link to="/{-$locale}/press" params={{ locale: undefined }}>Press archive</Link><span aria-hidden="true">/</span><span>{article.category}</span></nav>
      <header className="press-article-header"><p className="press-eyebrow">{article.publisher}</p><h1 ref={heading} tabIndex={-1}>{article.headline}</h1><p className="press-meta"><time dateTime={article.date}>{pressDate(article.date)}</time> · {article.category}</p><p className="press-lede">{article.summary}</p></header>
      <PressArticleContent article={article} includeHeader={false} />
      <div className="press-article-body">
        <div className="press-original"><h2>{article.format === "video" ? "Watch the original coverage" : article.format === "event" ? "Explore the event record" : "Read the original article"}</h2><p className="press-original-title">{article.title}</p><p className="press-meta">Published by {article.publisher}. Full reporting and any quoted figures remain attributed to the publisher.</p><Button href={article.url} size="lg" iconAfter="external-link">{article.videoId ? "Watch on YouTube" : article.format === "video" ? "Watch on Instagram" : article.format === "event" ? "View Chicago event archive" : "Read original article"}</Button></div>
      </div>
      <section className="press-related" aria-labelledby="related-title"><h2 id="related-title">More from the archive</h2><ul>{related.map((item) => <li key={item.slug}><p className="press-meta">{item.publisher} · {pressDate(item.date)}</p><Link to="/{-$locale}/press/$slug" params={{ locale: undefined, slug: item.slug }}>{item.headline} <span aria-hidden="true">↗</span></Link></li>)}</ul></section>
    </article>
  </PressShell>;
}