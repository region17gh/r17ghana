import { describe, expect, it } from "bun:test";
import { RUN_OF_SHOW, SPEAKERS, TIME_ZONES, currentSegment, formatRange, zoneShortName } from "@/lib/program";
import { MORE_VIDEOS, SHOWN_BY_DEFAULT } from "@/lib/program-videos";

describe("more videos", () => {
  it("shows two videos before any tapping", () => {
    expect(SHOWN_BY_DEFAULT).toBe(2);
  });
  it("keeps the rest behind the toggle", () => {
    expect(MORE_VIDEOS.length - SHOWN_BY_DEFAULT).toBe(3);
  });
});

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
  it("shows Central, West Coast and GMT clocks for every item", () => {
    expect(TIME_ZONES.map((z) => z.label)).toEqual(["CST", "PST", "GMT"]);
    expect(formatRange(RUN_OF_SHOW[0], TIME_ZONES[2].zone)).toBe("3:00 PM to 4:00 PM");
  });
});
