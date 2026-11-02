import { existsSync, readFileSync } from "node:fs";

import { describe, expect, test } from "bun:test";
import { eventPhase, FEATURED_EVENT } from "../src/lib/event";
import { signMeetingSdkJwt, MAX_TOKEN_SECONDS } from "../src/lib/zoom.server";
import { zoomJoinRefused } from "../src/lib/zoom-client";
import en from "../src/i18n/locales/en.json";

/** The hour a Chicago visitor reads on the homepage banner. */
function chicagoHour(instant: number) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(instant));
}

describe("online band phase", () => {
  test("upcoming before 9:00 AM Chicago on 12 Nov", () => expect(eventPhase(Date.parse("2026-11-12T14:59:00Z"))).toBe("upcoming"));
  test("live during the event", () => expect(eventPhase(Date.parse("2026-11-12T17:00:00Z"))).toBe("live"));
  const v = FEATURED_EVENT.virtual;
  test("online opens 8:45 AM Chicago", () => { expect(eventPhase(Date.parse("2026-11-12T14:44:00Z"), v.opensAt, v.closesAt)).toBe("upcoming"); expect(eventPhase(Date.parse("2026-11-12T14:45:00Z"), v.opensAt, v.closesAt)).toBe("live"); });
  test("online closes 1:15 PM Chicago", () => { expect(eventPhase(Date.parse("2026-11-12T19:14:00Z"), v.opensAt, v.closesAt)).toBe("live"); expect(eventPhase(Date.parse("2026-11-12T19:15:00Z"), v.opensAt, v.closesAt)).toBe("past"); });
  test("past after 1:00 PM Chicago", () => expect(eventPhase(Date.parse("2026-11-12T19:00:00Z"))).toBe("past"));
});

describe("online band copy", () => {
  test("the banner names the hour the online room actually opens, in Chicago time", () => {
    const opens = chicagoHour(FEATURED_EVENT.virtual.opensAt);
    expect(opens).toBe("8:45 AM");
    expect(en.virtual.upcoming).toContain(opens);
    expect(en.virtual.notReady).toContain(opens);
    expect(en.virtual.notOpenYet).toContain(opens);
    expect(en.virtual.soonBody).toContain(opens);
  });
});

describe("zoom join failure", () => {
  test("Zoom's own refusal is read as a code, not a browser failure", () => {
    expect(zoomJoinRefused({ errorCode: 3008, errorMessage: "Meeting has not started" })).toBe(3008);
    expect(zoomJoinRefused(new Error("Could not load /zoom/zoom-meeting-embedded-6.10.0.min.js"))).toBeUndefined();
    expect(zoomJoinRefused(undefined)).toBeUndefined();
    expect(zoomJoinRefused({ errorCode: "nope" })).toBeUndefined();
  });
});

describe("zoom signature", () => {
  test("attendee role 0 and pass outlasts the whole viewing window", async () => {
    const jwt = await signMeetingSdkJwt("key", "secret", "123456789", 1_800_000_000);
    const p = JSON.parse(atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    expect(p.role).toBe(0);
    expect(p.exp - p.iat).toBeGreaterThan((FEATURED_EVENT.virtual.closesAt - FEATURED_EVENT.virtual.opensAt) / 1000);
    expect(MAX_TOKEN_SECONDS).toBeLessThanOrEqual(48 * 3600);
  });
});

describe("zoom player files", () => {
  test("every file the loader asks for is served from public/zoom", () => {
    const src = readFileSync("src/lib/zoom-client.ts", "utf8");
    const files = [...src.matchAll(/`\$\{BASE\}\/([^`]+)`/g)].map((m) => m[1]);
    expect(files.length).toBeGreaterThanOrEqual(3);
    for (const f of files) expect(existsSync(`public/zoom/${f}`)).toBe(true);
  });
});
