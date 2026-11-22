/** A person or organisation named on the event flyer. `url` is omitted when
 *  no verifiable site exists for that name. */
export type EventPartner = { name: string; url?: string };

/** Hosts first, then partners, in the order the flyer presents them. */
const partners: EventPartner[] = [
  { name: "Embassy of Ghana to the United States", url: "https://washington.mfa.gov.gh/?lang=en" },
  { name: "Greater Boston Chamber of Commerce", url: "https://www.bostonchamber.com" },
  { name: "Massachusetts Business Roundtable", url: "https://www.maroundtable.com" },
  { name: "Massachusetts Office of International Trade & Investment", url: "https://www.mass.gov/orgs/massachusetts-office-of-international-trade-investment" },
  { name: "Ghana Association of Greater Boston", url: "https://gagb.net/index.html" },
];

/** The event promoted on the homepage. Times are absolute instants (EST is UTC-5). */
export const FEATURED_EVENT = {
  rsvpUrl: "https://luma.com/go9fl4ya",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=265+Franklin+St+Suite+1701+Boston+MA+02110",
  startsAt: Date.parse("2026-12-03T14:30:00Z"),
  endsAt: Date.parse("2026-12-03T17:00:00Z"),
  partners,
  /** Online attendance. Meeting credentials stay server-side; set a recording URL after the event. */
  virtual: {
    /** Off for Boston until an online room is confirmed. The window below is the Chicago one. */
    enabled: false,
    recordingUrl: undefined as string | undefined,
    /** Online viewing window: 8:45 AM to 1:15 PM Central (CST, UTC-6) on 12 Nov,
     *  matching the Zoom meeting's own time zone. */
    opensAt: Date.parse("2026-11-12T14:45:00Z"),
    closesAt: Date.parse("2026-11-12T19:15:00Z"),
  },
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
