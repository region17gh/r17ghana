import { describe, expect, it } from "bun:test";
import { buildIcs } from "@/lib/calendar";
import { RUN_OF_SHOW } from "@/lib/program";

describe("program calendar file", () => {
  it("puts the welcome remarks at 10:00 Central (16:00 UTC) on Nov 12, 2026", () => {
    const ics = buildIcs([RUN_OF_SHOW[1]], 0);
    expect(ics).toContain("DTSTART:20261112T160000Z");
    expect(ics).toContain("DTEND:20261112T160500Z");
  });
  it("whole program file holds all 12 items", () => {
    expect(buildIcs(RUN_OF_SHOW).match(/BEGIN:VEVENT/g)).toHaveLength(12);
  });
});
