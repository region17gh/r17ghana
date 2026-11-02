import { describe, expect, test } from "bun:test";
import { eventPhase } from "../src/lib/event";
import { signMeetingSdkJwt, MAX_TOKEN_SECONDS } from "../src/lib/zoom.server";

describe("online band phase", () => {
  test("upcoming before 9:00 AM Chicago on 12 Nov", () => expect(eventPhase(Date.parse("2026-11-12T14:59:00Z"))).toBe("upcoming"));
  test("live during the event", () => expect(eventPhase(Date.parse("2026-11-12T17:00:00Z"))).toBe("live"));
  test("past after 1:00 PM Chicago", () => expect(eventPhase(Date.parse("2026-11-12T19:00:00Z"))).toBe("past"));
});

describe("zoom signature", () => {
  test("attendee role 0 and lifetime of at most 2 hours", async () => {
    const jwt = await signMeetingSdkJwt("key", "secret", "123456789", 1_800_000_000);
    const p = JSON.parse(atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    expect(p.role).toBe(0);
    expect(p.exp - p.iat).toBeLessThanOrEqual(2 * 60 * 60);
    expect(MAX_TOKEN_SECONDS).toBe(7200);
  });
});
