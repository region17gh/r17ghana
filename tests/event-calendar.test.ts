import { describe, expect, test } from "bun:test";
import { calendarDate, calendarMonths, upcomingEvents } from "@/lib/event-calendar";
import { ROUNDS, type Round } from "@/lib/rounds";

const boston = ROUNDS.find((event) => event.slug === "boston-2026");
if (!boston) throw new Error("Boston event missing");

describe("upcoming event calendar", () => {
  test("lists Boston with its published December 3 date, Eastern times and RSVP", () => {
    const events = upcomingEvents(Date.parse("2026-11-23T08:06:00Z"));
    expect(events.map((event) => event.slug)).toEqual(["boston-2026"]);
    expect(calendarDate(boston).fullDate).toBe("Thursday, December 3, 2026");
    expect(calendarDate(boston).time).toBe("9:30 AM to 12:00 PM EST");
    expect(calendarDate(boston).gmt).toBe("14:30 to 17:00 GMT");
    expect(events[0]?.rsvp).toBe("https://luma.com/go9fl4ya");
  });
  test("keeps Boston during the event and removes it at noon Eastern", () => {
    expect(upcomingEvents(Date.parse("2026-12-03T16:59:59Z")).length).toBe(1);
    expect(upcomingEvents(Date.parse("2026-12-03T17:00:00Z"))).toEqual([]);
  });
  test("orders later events chronologically and groups by event month", () => {
    const next: Round = { ...boston, slug: "next", start: Date.parse("2027-02-01T15:00:00Z"), end: Date.parse("2027-02-01T18:00:00Z") };
    const events = upcomingEvents(Date.parse("2026-11-23T08:06:00Z"), [next, boston]);
    expect(events.map((event) => event.slug)).toEqual(["boston-2026", "next"]);
    expect(calendarMonths(events).map((group) => group.month)).toEqual(["December 2026", "February 2027"]);
  });
});