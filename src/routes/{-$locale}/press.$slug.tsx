import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PressArticle } from "@/components/press/PressArticle";
import { PressShell } from "@/components/press/PressShell";
import { publishedPress } from "@/lib/press-publication.functions";

export const Route = createFileRoute("/{-$locale}/press/$slug")({
  loader: async ({ params }) => {
    const catalog = await publishedPress();
    const article = catalog.find((item) => item.slug === params.slug);
    if (!article) throw notFound();
    return { ...article, catalog };
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
  errorComponent: () => <PressShell><p role="alert">Coverage is unavailable. Please try again.</p></PressShell>,
  notFoundComponent: () => <PressShell><div className="press-container press-detail"><h1>Article not found</h1><p>This story is not in the archive.</p><Link to="/{-$locale}/press" params={{ locale: undefined }}>Back to the press archive</Link></div></PressShell>,
});
function ArticlePage() {
  const article = Route.useLoaderData();
  return <PressArticle article={article} catalog={article.catalog} />;
}