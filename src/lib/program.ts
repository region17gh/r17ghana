import makedaPhoto from "@/assets/program/speaker-makeda-smith.jpg.asset.json";
import victorPhoto from "@/assets/program/speaker-victor-smith.jpg.asset.json";

/** Event program content. Bios are reproduced as supplied by each speaker. */
export type Speaker = { id: string; name: string; role: string; photo: string; alt: string; bio: string[] };

export const PROGRAM_TITLE = "U.S. and Ghana Regional Business and Investment Roundtable";
export const PROGRAM_PLACE = "November 12, 2026, mHUB, Chicago, Illinois";
export const PROGRAM_MC = "MC: Nana Asante-Smith Esq., Parker Poe Adams & Bernstein LLP";

export const SPEAKERS: Speaker[] = [
  {
    id: "victor-smith",
    name: "H.E. Victor Emmanuel Smith",
    role: "Ambassador of Ghana to the United States of America",
    photo: victorPhoto.url,
    alt: "Ambassador Victor Emmanuel Smith in a blue suit beside the flag of Ghana",
    bio: [
      "Ambassador Victor Emmanuel Smith is a seasoned Ghanaian politician, diplomat, statesman, and investment consultant whose distinguished career spans over three decades of public service, diplomacy, and private-sector advisory. With an exceptional blend of political acumen, diplomatic tact, and strategic foresight, he has served Ghana with distinction both at home and on the international stage.",
      "His professional footprint covers a rich portfolio of high-level leadership roles, including serving as Ghana’s High Commissioner to the United Kingdom and the Republic of Ireland, Ambassador to the Czech Republic, Hungary, and Slovakia, Eastern Regional Minister, and Presidential Advisor across three administrations. In each of these roles, Ambassador Smith has demonstrated a rare ability to lead with integrity, manage complex negotiations, and facilitate investments with national significance.",
      "As CEO of Victor Smith & Associates, he has been instrumental in catalyzing foreign direct investment into West Africa, brokering deals exceeding US$250 million in sectors such as energy, mining, agribusiness, and infrastructure. His work continues to support investors in navigating political and regulatory landscapes across the sub-region.",
      "Ambassador Smith’s diplomatic engagements have significantly elevated Ghana’s global profile, notably achieving an 18% increase in bilateral trade between Ghana and the UK during his tenure as High Commissioner. He is credited for launching high impact diaspora outreach programs and strengthening B2B collaborations through platforms like the Ghana-Central Europe Business Council.",
      "Academically grounded with an MBA in International Business from the University of Wales Business School and a BSc. (Hons) in Maritime Studies, Ambassador Smith is a well-rounded professional whose intellectual preparation has underpinned his effective diplomacy and executive leadership.",
      "He is a patron, board member, and mentor committed to grooming the next generation of leaders and professionals. A member of the Professional Forum of the NDC, and affiliated with the Ghanaian Professionals Network UK, he brings not only expertise but also an unwavering dedication to nation-building.",
      "Fluent in English, with working knowledge of French and native Ghanaian dialects, Ambassador Smith is not just a man of titles, but a man of impact, one whose legacy continues to inspire national and continental progress.",
    ],
  },
  {
    id: "makeda-smith",
    name: "Dr. Makeda Smith, Hon. D.Phil.",
    role: "Founder and CEO, Kingdom Citizens in Real Estate™ (KCIRE)",
    photo: makedaPhoto.url,
    alt: "Dr. Makeda Smith smiling, in a royal blue top and gold necklace",
    bio: [
      "Dr. Makeda Smith, Hon. D.Phil. is an international entrepreneur, real estate strategist, global speaker, author, and Kingdom leader with more than 22 years of experience in the real estate industry. She is the Founder and CEO of Kingdom Citizens in Real Estate™ (KCIRE), a global investment movement connecting diaspora investors to international real estate, business, and economic opportunities.",
      "Through the Global Marketplace & Economic Summit, she brings together investors, developers, government representatives, and business leaders to advance cross-border investment and economic collaboration.",
      "As the founder of Makeda Smith Global Ministries, her work also centers on identity, Kingdom leadership, purpose, and nation-building. Her message challenges individuals to move beyond personal success and build structures, opportunities, and legacies that will outlive them.",
      "Her philosophy: The assignment is bigger than you. The impact should outlive you.",
    ],
  },
];

/** Run of show. Instants are absolute; Central time on Nov 12 is CST (UTC-6). */
export type Segment = { start: number; end: number; title: string; lead: string };
const at = (hm: string) => Date.parse(`2026-11-12T${hm}:00-06:00`);
const seg = (s: string, e: string, title: string, lead: string): Segment => ({ start: at(s), end: at(e), title, lead });

export const RUN_OF_SHOW: Segment[] = [
  seg("09:00", "10:00", "Registration, VIP arrival and protocol", "All guests, dignitaries and speakers"),
  seg("10:00", "10:05", "Welcome remarks", "Senator Preston"),
  seg("10:05", "10:07", "Host remarks", "mHUB representative"),
  seg("10:07", "10:12", "GIPA video", "GIPA"),
  seg("10:12", "10:14", "Introduction of the Ambassador", "Adjoa B. Asamoah"),
  seg("10:14", "10:44", "Ambassador’s remarks, 30 minutes", "H.E. Victor Emmanuel Smith"),
  seg("10:44", "10:59", "GIPA presentation", "GIPA representative"),
  seg("10:59", "11:09", "Region 17 remarks", "Maabena Webb"),
  seg("11:09", "11:24", "Marketing, real estate and global investment", "Dr. Makeda Smith"),
  seg("11:24", "11:39", "Q&A", "Speakers and participants"),
  seg("11:39", "11:44", "Closing remarks", "Nana Asante-Smith"),
  seg("11:44", "12:44", "Lunch and networking", "All participants"),
];

/** Index of the segment running at `now`, or -1. */
export function currentSegment(now: number, list: Segment[] = RUN_OF_SHOW): number {
  return list.findIndex((s) => now >= s.start && now < s.end);
}

export function formatRange(s: Segment, timeZone: string): string {
  const f = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone });
  return `${f.format(s.start)} to ${f.format(s.end)}`;
}
