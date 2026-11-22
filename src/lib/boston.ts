/** Boston-Ghana Investment Roundtable, as published on the event flyer and Luma page. */
export const BOSTON = {
  title: "Boston-Ghana Investment Roundtable",
  theme: "Strengthening Ghana-Massachusetts Economic Partnerships",
  dateLine: "Thursday, December 3, 2026, 9:30 am to 12:00 pm (Eastern)",
  start: Date.parse("2026-12-03T09:30:00-05:00"),
  end: Date.parse("2026-12-03T12:00:00-05:00"),
  venue: ["265 Franklin Street, Suite 1701", "Boston, MA 02110"],
  rsvp: "https://luma.com/go9fl4ya",
  contact: "info@r17gh.com",
  partners: [
    "Embassy of Ghana to the United States",
    "Greater Boston Chamber of Commerce",
    "Massachusetts Business Roundtable",
    "Massachusetts Office of International Trade & Investment",
    "Ghana Association of Greater Boston",
  ],
  about: [
    "The Embassy of Ghana in the U.S., in partnership with the Greater Boston Chamber of Commerce, Massachusetts Business Roundtable, Massachusetts Office of International Trade & Investment and the Ghana Association of Greater Boston, is convening a business roundtable to drive bilateral economic relations between Ghana and Massachusetts.",
    "The room brings together the African diaspora and U.S. corporations, investors, universities, research institutions and strategic partners ready to explore Ghanaian expansion and opportunities across agribusiness, technology, healthcare, energy, manufacturing, financial services, tourism, arts, education and more.",
    "Come with the programs and collaborations you want to move, and leave with practical pathways to investment and institutional partnership.",
  ],
} as const;

/** Events listed on /events. Newest first within each group. */
export type EventEntry = { slug: string; title: string; when: string; where: string; href: string; upcoming: boolean };
export const EVENTS: EventEntry[] = [
  { slug: "boston-2026", title: BOSTON.title, when: "December 3, 2026", where: "Boston, Massachusetts", href: "/program", upcoming: true },
  { slug: "chicago-2026", title: "U.S. and Ghana Regional Business and Investment Roundtable", when: "November 12, 2026", where: "mHUB, Chicago, Illinois", href: "/events/roundtables/chicago", upcoming: false },
];
