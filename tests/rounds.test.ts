import { describe, expect, test } from "bun:test";
import { currentRound, ROUNDS, type Round } from "@/lib/rounds";

const boston = ROUNDS[0]!;
const next: Round = { ...boston, slug: "next", start: Date.parse("2027-02-01T15:00:00Z"), end: Date.parse("2027-02-01T18:00:00Z") };

describe("current round on /program", () => {
  test("Boston is shown before and during 3 Dec", () => expect(currentRound(Date.parse("2026-12-03T15:00:00Z")).slug).toBe("boston-2026"));
  test("the next round swaps in once Boston ends", () => expect(currentRound(Date.parse("2026-12-03T17:01:00Z"), [next, boston]).slug).toBe("next"));
  test("with no later round, the last one stays", () => expect(currentRound(Date.parse("2027-06-01T00:00:00Z"), [boston, next]).slug).toBe("next"));
});
