import { Link, createFileRoute } from "@tanstack/react-router";
import { PublicationReview } from "@/components/features/PublicationReview";
import { usePressArticleFocus } from "@/hooks/usePressArticleFocus";

export const Route = createFileRoute("/_authenticated/publications")({
  head: () => ({ meta: [
    { title: "Publication panel | Region 17 Ghana" },
    { name: "description", content: "Private operator review for Boston questions and press coverage." },
    { property: "og:title", content: "Publication panel | Region 17 Ghana" },
    { property: "og:description", content: "Private question approval and coverage publishing." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: PublicationsPage,
});
function PublicationsPage() {
  const heading = usePressArticleFocus("publications");
  return <main className="events-hub"><Link to="/{-$locale}/events" params={{ locale: undefined }}>Region 17 events</Link>
    <h1 ref={heading} tabIndex={-1} className="program-h1">Publication panel</h1><PublicationReview /></main>;
}