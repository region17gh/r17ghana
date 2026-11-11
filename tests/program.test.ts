import { describe, expect, it } from "bun:test";
import { RUN_OF_SHOW, SPEAKERS, currentSegment, formatRange, zoneShortName } from "@/lib/program";

describe("program", () => {
  it("shows Central times as supplied", () => {
    expect(formatRange(RUN_OF_SHOW[5], "America/Chicago")).toBe("10:14 AM to 10:44 AM");
  });
  it("highlights the Ambassador's remarks at 10:20 AM Central", () => {
    expect(currentSegment(Date.parse("2026-11-12T10:20:00-06:00"))).toBe(5);
  });
  it("highlights nothing before registration opens", () => {
    expect(currentSegment(Date.parse("2026-11-12T08:59:00-06:00"))).toBe(-1);
  });
  it("lists two speakers", () => {
    expect(SPEAKERS).toHaveLength(2);
  });
  it("names the viewer's zone for the event date", () => {
    expect(zoneShortName("America/Los_Angeles", RUN_OF_SHOW[0].start)).toBe("PST");
  });
  it("falls back to the zone name when no short label exists", () => {
    expect(zoneShortName("Not/AZone")).toBe("Not/AZone");
  });
});
