import { createFileRoute } from "@tanstack/react-router";
import { PressArchive } from "@/components/press/PressArchive";
import { publishedPress } from "@/lib/press-publication.functions";

const description = "Explore Region 17 Ghana press coverage and announcements, from the Diaspora Summit to our launch and business roundtables.";
export const Route = createFileRoute("/{-$locale}/press/")({
  loader: () => publishedPress(),
  staleTime: 0,
  head: () => ({ meta: [
    { title: "Press archive | Region 17 Ghana" },
    { name: "description", content: description },
    { property: "og:title", content: "Press archive | Region 17 Ghana" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ArchivePage,
  errorComponent: () => <p role="alert">The press archive is unavailable. Please try again.</p>,
});
function ArchivePage() { return <PressArchive catalog={Route.useLoaderData()} />; }