import { createFileRoute } from "@tanstack/react-router";
import { RoundProgram } from "@/components/program/RoundProgram";
import { useEventClock } from "@/hooks/useEventClock";
import { currentRound } from "@/lib/rounds";

export const Route = createFileRoute("/{-$locale}/program")({
  head: () => {
    const round = currentRound(Date.now());
    const title = `Program | ${round.title} | Region 17`;
    const description = `${round.dateLine}: ${round.theme}.`;
    return { meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ] };
  },
  component: CurrentProgram,
});

function CurrentProgram() {
  const now = useEventClock();
  const round = currentRound(now);
  return <RoundProgram round={round} past={now >= round.end} />;
}
