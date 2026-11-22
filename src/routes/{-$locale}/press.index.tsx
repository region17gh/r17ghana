import { createFileRoute } from "@tanstack/react-router";
import { PressArchive } from "@/components/press/PressArchive";

const description = "Explore Region 17 Ghana press coverage and announcements, from the Diaspora Summit to our launch and business roundtables.";
export const Route = createFileRoute("/{-$locale}/press/")({
  head: () => ({ meta: [
    { title: "Press archive | Region 17 Ghana" },
    { name: "description", content: description },
    { property: "og:title", content: "Press archive | Region 17 Ghana" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PressArchive,
});