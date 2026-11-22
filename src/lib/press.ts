import chicagoPhoto from "@/assets/events/chicago-photos/aa-group-photo-1600.jpg.asset.json";

export type PressCategory = "Media coverage" | "Announcements" | "Diaspora context";
export interface PressArticle {
  slug: string;
  title: string;
  headline: string;
  publisher: string;
  date: string;
  category: PressCategory;
  url: string;
  summary: string;
  paragraphs: string[];
  note?: string;
  videoId?: string;
  format?: "video" | "event";
  image?: { url: string; alt: string; caption: string };
}

/** Original editorial summaries, not reproductions of publishers' articles. */
export const PRESS_ARTICLES: PressArticle[] = [
  {
    slug: "washington-diplomatic-times-launch", title: "Ghana's Embassy in Washington launches Region 17 to court diaspora investment",
    headline: "Diplomatic Times covers the Washington launch", publisher: "Diplomatic Times Online", date: "2026-08-03", category: "Media coverage",
    url: "https://www.diplomatictimesonline.com/ghanas-embassy-in-washington-launches-region-17-to-court-diaspora-investment/",
    summary: "Diplomatic Times reports on the July 30 launch and its focus on diaspora expertise, investment and national development.",
    paragraphs: ["Richmond Fordjour Ampofo reports on the launch of Region 17 in Washington, D.C., and the role of diaspora professionals, entrepreneurs and development partners.", "The article discusses remittances and structured participation in Ghana's development. Its economic figures remain attributed to the publisher and are not independently verified here or presented as an investment offer."],
  },
  {
    slug: "washington-official-launch-recap", title: "Washington, D.C. launch: official video recap",
    headline: "A look back at the Washington launch", publisher: "Region 17 Ghana", date: "2026-08-07", category: "Announcements", format: "video",
    url: "https://www.instagram.com/reel/Dbwdc3RNZho/",
    summary: "Region 17's official Instagram recap of the July 30 Washington, D.C. launch.",
    paragraphs: ["Region 17 shares a video recap of its Washington, D.C. launch on Instagram. The launch brought together diaspora participants and institutional partners to discuss national development.", "Open the original post to watch the recap. Instagram may require sign-in."],
    note: "Post date and description supplied by Region 17. The Instagram recording was not independently accessible for verification.",
  },
  {
    slug: "chicago-roundtable-event-record", title: "Ghana-Chicago Business Roundtable, November 12, 2026",
    headline: "Chicago roundtable: the event record", publisher: "Region 17 Ghana", date: "2026-11-12", category: "Announcements", format: "event",
    url: "https://r17gh.com/events/roundtables/chicago",
    summary: "The Chicago roundtable's videos, speaker biographies, guest testimonials and photographs are preserved in the event archive.",
    paragraphs: ["Region 17's November 12 roundtable at mHUB Chicago brought diaspora guests and business participants together with the Embassy of Ghana in the United States.", "The event archive preserves the published run of show, speaker biographies, recordings and guest testimonials. These materials document the discussions without promising investment, employment or immigration outcomes."],
  },
  {
    slug: "chicago-diaspora-ownership", title: "A Seat at the Table: Region 17 Challenges Diaspora Ghanaians to Transform $7.8 Billion in Remittances into Ownership of Ghana's Future",
    headline: "From remittances to participation: the Chicago conversation", publisher: "SankofaOnline", date: "2026-11-15", category: "Media coverage",
    url: "https://sankofaonline.com/a-seat-at-the-table-region-17-challenges-diaspora-ghanaians-to-transform-7-8-billion-in-remittances-into-ownership-of-ghanas-future/",
    summary: "Reporting from Chicago on the diaspora's role in Ghana's development and the discussion around long-term participation.",
    paragraphs: ["SankofaOnline covers Region 17's Chicago discussions about how diaspora engagement can extend beyond remittances to participation in Ghana's future.", "The article presents the publisher's account of the conversation. Its financial figures and investment perspectives belong to the source and are not an offer or a promise by Region 17."],
  },
  {
    slug: "chicago-business-roundtable", title: "Ambassador Victor Smith Mobilizes Chicago's Corporate Powerhouses to Drive Ghana's Industrial Transformation and Unlock Africa's 1.4 Billion-Consumer Market",
    headline: "Ghana and Chicago: a conversation on business and development", publisher: "SankofaOnline", date: "2026-11-13", category: "Media coverage",
    url: "https://sankofaonline.com/ambassador-victor-smith-mobilizes-chicagos-corporate-powerhouses-to-drive-ghanas-industrial-transformation-and-unlock-africas-1-4-billion-consumer-market/",
    summary: "Ambassador Victor Emmanuel Smith brings Ghana's development priorities to Chicago's business community.",
    paragraphs: ["SankofaOnline reports on Ambassador Victor Emmanuel Smith's engagement with Chicago business leaders and the discussion of Ghana's industrial development priorities.", "The coverage connects the Chicago roundtable to a broader conversation about trade and economic partnerships. Videos, speaker biographies, photographs and the run of show are preserved in the Chicago event archive."],
    image: { url: chicagoPhoto.url, alt: "Ambassador Victor Smith with participants during the Chicago visit", caption: "Participants during the Chicago visit, November 2026. Region 17 event archive." },
  },
  {
    slug: "chicago-accountability-dialogue", title: "Accountability Over Ego: How Chicago's Dialogue with Ambassador Victor Smith Challenges the Culture of Personal Politics in the Diaspora",
    headline: "Accountability at the center of the diaspora dialogue", publisher: "SankofaOnline", date: "2026-11-13", category: "Media coverage",
    url: "https://sankofaonline.com/accountability-over-ego-how-chicagos-dialogue-with-ambassador-victor-smith-challenges-the-culture-of-personal-politics-in-the-diaspora/",
    summary: "A perspective on accountability and community engagement during the Ambassador's Chicago visit.",
    paragraphs: ["This SankofaOnline commentary examines accountability and community leadership through the dialogue with Ambassador Victor Smith in Chicago.", "The views and interpretation are those of the publisher. Read the original article for its complete argument and context."],
  },
  {
    slug: "chicago-diaspora-concerns", title: "Ambassador Smith Tackles Diaspora Concerns on Investment, Consular Services, Delayed Payments and Student Support",
    headline: "Chicago guests raise practical diaspora concerns", publisher: "SankofaOnline", date: "2026-11-12", category: "Media coverage",
    url: "https://sankofaonline.com/ambassador-smith-tackles-diaspora-concerns-on-investment-consular-services-delayed-payments-and-student-support/",
    summary: "Coverage of questions on investment, consular services and student support during the Chicago visit.",
    paragraphs: ["SankofaOnline reports on the practical questions diaspora participants raised with Ambassador Victor Smith, including investment, consular services, delayed payments and student support.", "This is an archive of press coverage, not guidance on eligibility or consular outcomes. Questions about citizenship, Right of Abode or the Ghana Card should go to Ghana's Diaspora Affairs Office or the Ministry of the Interior."],
  },
  {
    slug: "region17-washington-launch-announcement", title: "Region17Gh launched in Washington, D.C. to harness Ghanaian diaspora for national dev’t",
    headline: "Region 17 announces its Washington, D.C. launch", publisher: "Region 17 Ghana", date: "2026-08-19", category: "Announcements",
    url: "https://region17gh.org/region17gh-launched-in-washington-d-c-to-harness-ghanaian-diaspora-for-national-devt/",
    summary: "The launch announcement sets out a platform for diaspora expertise, innovation and national development.",
    paragraphs: ["Region 17's published announcement describes the July 30, 2026 launch in Washington, D.C. and the organization's intention to connect diaspora expertise and networks with Ghana's development priorities.", "It names Ambassador Victor Emmanuel Smith as Lifetime Patron and Maabena Ohene-Kena Webb as Executive Director. Region 17 Ghana is a nonprofit initiative, not a government body."],
  },
  {
    slug: "washington-diaspora-initiative", title: "Region 17 initiative launched in Washington to mobilise Ghanaian diaspora for national development",
    headline: "A structured platform for diaspora participation", publisher: "Region 17 Ghana", date: "2026-08-17", category: "Announcements",
    url: "https://region17gh.org/region-17-initiative-launched-in-washington-to-mobilise-ghanaian-diaspora-for-national-development/",
    summary: "Region 17's published launch coverage outlines the initiative's national development focus.",
    paragraphs: ["This launch coverage on Region 17's original website introduces the initiative's focus on mobilizing Ghanaian diaspora expertise and connections for national development.", "The announcement belongs to the Washington launch record. Region 17 Ghana operates as a nonprofit initiative and does not confer government or immigration standing."],
  },
  {
    slug: "terkper-diaspora-development", title: "Terkper urges Ghana to redirect diaspora remittances into national development as Region 17 is launched in U.S.",
    headline: "Seth Terkper on diaspora participation in national development", publisher: "Kumasi Mail", date: "2026-08-06", category: "Media coverage",
    url: "https://kumasimail.com/terkper-urges-ghana-to-redirect-diaspora-remittances-into-national-development-as-region-17-is-launched-in-u-s/",
    summary: "Kumasi Mail reports on Seth Terkper's remarks at the Washington launch.",
    paragraphs: ["Kumasi Mail covers Presidential Advisor Seth Terkper's remarks about the contribution of diaspora remittances, professional expertise and innovation to national development.", "The report also addresses the importance of credibility and consistent policy. Read the source for the full remarks and the publisher's economic analysis."],
  },
  {
    slug: "gna-washington-launch", title: "Region17Gh launched in Washington, D.C. to mobilise Ghanaians abroad for development",
    headline: "Ghana News Agency reports on the Region 17 launch", publisher: "Ghana News Agency", date: "2026-08-04", category: "Media coverage",
    url: "https://gna.org.gh/2026/08/region17gh-launched-in-washington-d-c-to-mobilise-ghanaians-abroad-for-development/",
    summary: "National news coverage of the nonprofit's launch and its focus on diaspora expertise and collaboration.",
    paragraphs: ["Ghana News Agency reports that Region 17 Ghana launched in Washington, D.C. on July 30, 2026, with the aim of organizing diaspora expertise, innovation and global networks for national development.", "The report includes remarks from Ambassador Victor Emmanuel Smith and Executive Director Maabena Ohene-Kena Webb on collaboration, trust and practical participation."],
  },
  {
    slug: "citi-washington-launch", title: "Region17Gh launched in Washington, D.C. to harness Ghanaian diaspora for national dev’t",
    headline: "Citi Newsroom covers the Washington, D.C. launch", publisher: "Citi Newsroom", date: "2026-08-03", category: "Media coverage",
    url: "https://www.citinewsroom.com/2026/08/region17gh-launched-in-washington-d-c-to-harness-ghanaian-diaspora-for-national-devt/",
    summary: "The launch brings diaspora professionals, entrepreneurs and partners into a shared development conversation.",
    paragraphs: ["Citi Newsroom's report describes the Washington launch of Region 17 Ghana, a U.S.-registered nonprofit, and its proposed role in connecting diaspora talent with Ghana's development priorities.", "The article covers the launch theme and Ambassador Victor Emmanuel Smith's keynote remarks. The complete report remains available from Citi Newsroom."],
  },
  {
    slug: "diaspora-seventeenth-region-analysis", title: "Diaspora: in Ghana, the “17th Region” takes shape between memory, influence and investment",
    headline: "The 17th Region: from shared memory to practical connection", publisher: "Africa News Agency", date: "2026-02-21", category: "Diaspora context",
    url: "https://africa-news-agency.com/diaspora-in-ghana-the-17th-region-takes-shape-between-memory-influence-and-investment/",
    summary: "An analysis of the Diaspora Summit and Ghana's evolving relationship with Africans abroad.",
    paragraphs: ["Africa News Agency examines the December 2025 Diaspora Summit and the conversation about moving diaspora engagement from symbolic ties toward practical partnerships in investment, skills transfer and innovation.", "The analysis provides background to the 17th Region concept. It describes Ghana's wider diaspora policy conversation rather than announcing a Region 17 Ghana service."],
    note: "Originally published by Africa News Agency on December 22, 2025. Republished on Region17GH on February 21, 2026; this archive uses the republication date.",
  },
  {
    slug: "accra-diaspora-summit", title: "Maiden diaspora summit opens in Ghana to reunite global Africans for development",
    headline: "Accra hosts the inaugural Diaspora Summit", publisher: "Xinhua", date: "2025-12-20", category: "Diaspora context",
    url: "https://english.news.cn/africa/20251220/66e20f12ab5a46bfbea5533000f24142/c.html",
    summary: "International reporting on the two-day summit that brought global Africans together in Accra.",
    paragraphs: ["Xinhua reports on the opening of the Diaspora Summit in Accra on December 19, 2025, including President John Dramani Mahama's remarks on African unity and historical justice.", "The coverage provides context for Ghana's recognition of the global diaspora as its 17th Region. That declaration does not make Region 17 Ghana a government body or confer immigration standing on its members."],
  },
  {
    slug: "diaspora-summit-joynews", title: "Diaspora Summit 2025: Resetting Ghana - The Diaspora as the 17th Region",
    headline: "Watch: the 2025 Diaspora Summit", publisher: "JoyNews", date: "2025-12-19", category: "Diaspora context",
    url: "https://www.youtube.com/watch?v=ooj5ev3pJQQ",
    videoId: "ooj5ev3pJQQ",
    format: "video",
    summary: "JoyNews video coverage of the summit on Ghana's connection with the global African diaspora.",
    paragraphs: ["JoyNews presents video coverage of the 2025 Diaspora Summit under the theme of resetting Ghana and recognizing the diaspora as the 17th Region.", "Watch the original broadcast on YouTube for the full proceedings. This summit coverage provides background to the diaspora conversation, rather than a recording of a Region 17 Ghana roundtable."],
    note: "Summit date: December 19, 2025. The linked broadcast is published by JoyNews, not Africa News; the archive credits the verified channel.",
  },
];

export const FEATURED_PRESS = PRESS_ARTICLES.find((article) => article.slug === "chicago-business-roundtable");
export const PRESS_CATEGORIES: PressCategory[] = ["Media coverage", "Announcements", "Diaspora context"];
export function pressDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
export function filterPress(query: string, category: string, year: string, catalog: PressArticle[] = PRESS_ARTICLES): PressArticle[] {
  const term = query.trim().toLowerCase();
  return catalog.filter((article) =>
    (!category || article.category === category) && (!year || article.date.startsWith(year)) &&
    (!term || `${article.title} ${article.headline} ${article.publisher} ${article.summary}`.toLowerCase().includes(term)),
  ).sort((a, b) => b.date.localeCompare(a.date));
}