/** The event promoted on the homepage. Times are absolute instants (CST is UTC-6). */
export const FEATURED_EVENT = {
  rsvpUrl: "https://luma.com/j9k2s0o3",
  startsAt: Date.parse("2026-11-12T15:00:00Z"),
  endsAt: Date.parse("2026-11-12T19:00:00Z"),
  partners: [
    "Embassy of Ghana in the U.S.",
    "Ghana National Council of Metropolitan Chicago",
    "mHUB",
    "Rosca",
    "Maabena",
  ],
};

export type EventPhase = "upcoming" | "live" | "past";

export function eventPhase(now: number, start = FEATURED_EVENT.startsAt, end = FEATURED_EVENT.endsAt): EventPhase {
  if (now < start) return "upcoming";
  if (now < end) return "live";
  return "past";
}

export function timeUntil(now: number, start = FEATURED_EVENT.startsAt) {
  const ms = Math.max(0, start - now);
  return { days: Math.floor(ms / 86_400_000), hours: Math.floor((ms % 86_400_000) / 3_600_000) };
}
