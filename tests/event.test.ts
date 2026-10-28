import { describe, expect, test } from "bun:test";

import { eventPhase, timeUntil } from "../src/lib/event";

describe("featured event phase", () => {
  test("before 9:00 AM CST on 12 November is upcoming", () => {
    expect(eventPhase(Date.parse("2026-11-12T14:59:00Z"))).toBe("upcoming");
  });
  test("during the roundtable is live", () => {
    expect(eventPhase(Date.parse("2026-11-12T17:00:00Z"))).toBe("live");
  });
  test("after 1:00 PM CST is past", () => {
    expect(eventPhase(Date.parse("2026-11-12T19:00:00Z"))).toBe("past");
  });
  test("countdown from 28 October 22:00 UTC", () => {
    expect(timeUntil(Date.parse("2026-10-28T22:00:00Z"))).toEqual({ days: 14, hours: 17 });
  });
});
