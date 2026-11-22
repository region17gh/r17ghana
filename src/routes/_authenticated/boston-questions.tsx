import { createFileRoute, Link } from "@tanstack/react-router";
import { BostonQuestionReview } from "@/components/features/BostonQuestionReview";

export const Route = createFileRoute("/_authenticated/boston-questions")({
  head: () => ({ meta: [
    { title: "Review Boston questions | Region 17 Ghana" },
    { name: "description", content: "Private team review of guest questions for the Boston roundtable." },
    { property: "og:title", content: "Review Boston questions | Region 17 Ghana" },
    { property: "og:description", content: "Private team review of Boston guest submissions." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: ReviewPage,
});
function ReviewPage() {
  return <main className="program-page"><Link to="/{-$locale}/program" params={{ locale: undefined }}>Boston program</Link>
    <h1 className="program-h1">Review Boston questions</h1><BostonQuestionReview /></main>;
}