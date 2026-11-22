import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PressArticle } from "@/components/press/PressArticle";
import { PressShell } from "@/components/press/PressShell";
import { PRESS_ARTICLES } from "@/lib/press";

export const Route = createFileRoute("/{-$locale}/press/$slug")({
  loader: ({ params }) => {
    const article = PRESS_ARTICLES.find((item) => item.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.headline} | Region 17 Ghana` : "Article unavailable | Region 17 Ghana" },
    { name: "description", content: loaderData?.summary ?? "This press article is unavailable." },
    { property: "og:title", content: loaderData?.headline ?? "Article unavailable" },
    { property: "og:description", content: loaderData?.summary ?? "Browse the Region 17 Ghana press archive." },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(!loaderData ? [{ name: "robots", content: "noindex" }] : []),
  ] }),
  component: ArticlePage,
  notFoundComponent: () => <PressShell><div className="press-container press-detail"><h1>Article not found</h1><p>This story is not in the archive.</p><Link to="/{-$locale}/press" params={{ locale: undefined }}>Back to the press archive</Link></div></PressShell>,
});
function ArticlePage() {
  const article = Route.useLoaderData();
  return <PressArticle article={article} />;
}