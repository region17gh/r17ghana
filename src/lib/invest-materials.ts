import { FAQ, INCENTIVES, LAW_CARDS, ORG_LINE, REGION_STRENGTHS, SECTORS, STATS, STEPS, WHY_NOW } from "@/lib/invest/content";

/** Plain-text pack of what /invest publishes; the investor Q&A answers only from this. */
export function investMaterials(): string {
  return [
    `ABOUT\n${ORG_LINE}`,
    `WHY NOW\n${WHY_NOW.title} ${WHY_NOW.lede}\n` +
      STATS.map((s) => `- ${s.value}${s.unit} ${s.label} (${s.source}, ${s.year}, estimate). ${s.signal}`).join("\n"),
    `INCENTIVES\n` + INCENTIVES.map((i) => `- ${i.figure}: ${i.text}`).join("\n"),
    `REGION STRENGTHS\n` + Object.entries(REGION_STRENGTHS).map(([r, s]) => `- ${r}: ${s.join(", ")}`).join("\n"),
    `2026 LAW\n` + LAW_CARDS.map((l) => `- ${l.title}: ${l.body}`).join("\n"),
    `HOW IT WORKS\n` + STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join("\n"),
    `SECTORS\n` + SECTORS.map((s) => `- ${s.label}: ${s.body}`).join("\n"),
    `FAQ\n` + FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n"),
  ].join("\n\n");
}
