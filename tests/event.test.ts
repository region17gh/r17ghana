import { describe, expect, test } from "bun:test";

import { eventPhase, timeUntil, FEATURED_EVENT } from "../src/lib/event";
import en from "../src/i18n/locales/en.json";

describe("featured event phase", () => {
  test("before 9:00 AM CST on 12 November is upcoming", () => {
    expect(eventPhase(Date.parse("2026-12-03T14:29:00Z"))).toBe("upcoming");
  });
  test("during the roundtable is live", () => {
    expect(eventPhase(Date.parse("2026-12-03T16:00:00Z"))).toBe("live");
  });
  test("after 1:00 PM CST is past", () => {
    expect(eventPhase(Date.parse("2026-12-03T17:00:00Z"))).toBe("past");
  });
  test("countdown from 22 November 22:30 UTC", () => {
    expect(timeUntil(Date.parse("2026-11-22T22:30:00Z"))).toEqual({ days: 10, hours: 16 });
  });
  test("countdown reads zero at the moment the event starts", () => {
    expect(timeUntil(Date.parse("2026-12-03T14:30:00Z"))).toEqual({ days: 0, hours: 0 });
  });
  test("countdown never goes negative once the event has begun", () => {
    expect(timeUntil(Date.parse("2026-12-04T14:30:00Z"))).toEqual({ days: 0, hours: 0 });
  });
  test("the phase is live from the first minute of the event day, so the ticker is off", () => {
    expect(eventPhase(Date.parse("2026-12-03T14:30:00Z"))).toBe("live");
  });
  test("the phase is past the next day, so the ticker stays removed", () => {
    expect(eventPhase(Date.parse("2026-12-04T14:30:00Z"))).toBe("past");
  });
});

describe("homepage wording matches the flyer", () => {
  const names = FEATURED_EVENT.partners.map((p) => p.name);
  test("the section is titled after the roundtable the flyer names", () => {
    expect(en.landing.eventTitle).toContain("Boston-Ghana Investment Roundtable");
    expect(en.landing.past).toContain("Boston-Ghana Investment Roundtable");
  });
  test("the presented-by list carries every host and partner on the flyer", () => {
    expect(names.some((n) => n.startsWith("Embassy of Ghana"))).toBe(true);
    expect(names).toContain("Greater Boston Chamber of Commerce");
    expect(names).toContain("Massachusetts Business Roundtable");
    expect(names).toContain("Massachusetts Office of International Trade & Investment");
    expect(names).toContain("Ghana Association of Greater Boston");
  });
  test("the lede credits the flyer's hosts", () => {
    expect(en.landing.eventLede).toContain("Embassy of Ghana");
    expect(en.landing.eventLede).toContain("Greater Boston Chamber of Commerce");
    expect(en.landing.eventLede).toContain("Ghana Association of Greater Boston");
  });
});
