import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon, perkHead } from "@/components/site/ComingSoon";
import { PERKS } from "@/lib/site/content";

const perk = PERKS.find((p) => p.slug === "knowledge")!;

export const Route = createFileRoute("/{-$locale}/knowledge")({
  head: () => perkHead(perk),
  component: () => <ComingSoon perk={perk} />,
});
