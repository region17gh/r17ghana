import { BOSTON } from "@/lib/boston";

/** One roundtable in the series. /program always shows the current round, so a
 *  future round goes live by adding an entry here, nothing else. */
export type Round = {
  slug: string;
  title: string;
  theme: string;
  dateLine: string;
  start: number;
  end: number;
  venue: readonly string[];
  rsvp: string;
  contact: string;
  partners: readonly string[];
  about: readonly string[];
  /** Speaker ids from src/lib/program.ts; empty until confirmed. */
  speakerIds: readonly string[];
};

export const ROUNDS: Round[] = [
  { slug: "boston-2026", ...BOSTON, speakerIds: ["victor-smith"] },
  // Next round: add it here with its own slug, dates and details.
];

/** The round /program shows: the first that has not ended, else the latest one. */
export function currentRound(now: number, rounds: Round[] = ROUNDS): Round {
  const sorted = [...rounds].sort((a, b) => a.start - b.start);
  return sorted.find((r) => r.end > now) ?? sorted[sorted.length - 1]!;
}
