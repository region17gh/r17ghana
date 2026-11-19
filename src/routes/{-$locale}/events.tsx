import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon, perkHead } from "@/components/site/ComingSoon";
import { PERKS } from "@/lib/site/content";

const perk = PERKS.find((p) => p.slug === "events")!;

export const Route = createFileRoute("/{-$locale}/events")({
  head: () => perkHead(perk),
  component: () => <ComingSoon perk={perk} />,
});
