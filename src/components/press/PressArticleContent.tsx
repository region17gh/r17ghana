import { pressDate, type PressArticle } from "@/lib/press";
import { PressVideo } from "@/components/press/PressVideo";

export function PressArticleContent({ article, includeHeader = true }: { article: PressArticle; includeHeader?: boolean }) {
  return <>
    {includeHeader && <header className="press-article-header"><p className="press-eyebrow">{article.publisher}</p><h2>{article.headline}</h2><p className="press-meta"><time dateTime={article.date}>{pressDate(article.date)}</time> · {article.category}</p><p className="press-lede">{article.summary}</p></header>}
    {article.image && <figure className="press-article-image"><img src={article.image.url} alt={article.image.alt} /><figcaption className="press-caption">{article.image.caption}</figcaption></figure>}
    {article.videoId && <PressVideo key={article.slug} videoId={article.videoId} title={article.title} />}
    <div className="press-article-body"><p className="press-eyebrow">Coverage summary</p>{article.paragraphs.map((text) => <p key={text}>{text}</p>)}{article.note && <p className="press-source-note">{article.note}</p>}</div>
  </>;
}