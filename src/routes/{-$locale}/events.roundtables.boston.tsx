import { createFileRoute } from "@tanstack/react-router";
import { RoundProgram } from "@/components/program/RoundProgram";
import { useEventClock } from "@/hooks/useEventClock";
import { BOSTON } from "@/lib/boston";

const round = { ...BOSTON, slug: "boston-2026", speakerIds: ["victor-smith"] };
const description = `${BOSTON.dateLine}. Event details, partners and confirmed speakers for the Boston-Ghana Investment Roundtable.`;

export const Route = createFileRoute("/{-$locale}/events/roundtables/boston")({
  head: () => ({ meta: [
    { title: "Boston roundtable | Region 17 Ghana events" },
    { name: "description", content: description },
    { property: "og:title", content: "Boston-Ghana Investment Roundtable | Region 17 Ghana" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: BostonArchive,
});

function BostonArchive() {
  const now = useEventClock();
  return <RoundProgram round={round} past={now >= BOSTON.end} />;
}