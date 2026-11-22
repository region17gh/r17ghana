import { expect, test } from "bun:test";
import { BOSTON, eventEntries } from "@/lib/boston";

test("Boston remains in upcoming until December 3, 2026 at noon Eastern", () => {
  const entry = eventEntries(Date.parse("2026-12-03T11:59:59-05:00")).find((e) => e.slug === "boston-2026");
  expect(entry?.upcoming).toBe(true);
  expect(entry?.href).toBe("/events/roundtables/boston");
});

test("Boston automatically enters the hub archive at noon Eastern", () => {
  expect(BOSTON.end).toBe(Date.parse("2026-12-03T12:00:00-05:00"));
  const entry = eventEntries(BOSTON.end).find((e) => e.slug === "boston-2026");
  expect(entry?.upcoming).toBe(false);
  expect(entry?.href).toBe("/events/roundtables/boston");
});

test("Chicago keeps its permanent archive after Boston ends", () => {
  const entry = eventEntries(BOSTON.end).find((e) => e.slug === "chicago-2026");
  expect(entry?.href).toBe("/events/roundtables/chicago");
  expect(entry?.upcoming).toBe(false);
});