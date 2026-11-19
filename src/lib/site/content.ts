/**
 * Brand site copy, drafted from the R17GH Business Model Foundation (Oct 2026)
 * and awaiting leadership review. Deliberately omitted until settled: paid
 * tiers and prices, the fund question, revenue figures, the first host region.
 * Plain institutional voice; no dashes as sentence punctuation.
 */
export const TAGLINE = "Ghana's 17th Region, mobilized.";
export const MOTTO = "One Nation. One Global Diaspora. One Shared Vision.";
export const INTRO =
  "Region 17 creates the conditions for the African diaspora, together with the continent and its allies, to drive progress through Ghana's 16 regions and beyond.";

export const WHY_NOW = {
  title: "Ghana has sixteen regions. The seventeenth lives everywhere else.",
  body: "In December 2025, Ghana declared the global African diaspora its seventeenth region. That strength is real, but scattered. Region 17 gives it a home base: one membership, connected to the sixteen regions, with what it builds recorded and seen.",
};

export type Perk = { slug: "programs" | "events" | "resources" | "knowledge" | "services"; name: string; verb: string; first: string; about: string };
export const PERKS: Perk[] = [
  { slug: "programs", name: "Programs", verb: "We design, develop and deliver", first: "Diaspora Delegations", about: "Week-long visits to one region with a purpose: district leaders, businesses, projects and culture, in a small group. A licensed tour operator handles travel." },
  { slug: "events", name: "Events", verb: "We create, manage and promote", first: "Region 17 Summit 2027", about: "Our annual flagship each December, when the diaspora is home. A business forum, regional leaders and investors, and the host region's culture." },
  { slug: "resources", name: "Resources", verb: "We publish what you need to know", first: "Ground Truth", about: "A monthly live session with the people who do the work in Ghana: lawyers, accountants, surveyors, bankers and founders. One practical question, answered plainly." },
  { slug: "knowledge", name: "Knowledge transfer", verb: "We move expertise across borders", first: "Diaspora SME Knowledge Exchange", about: "Cohort courses led by diaspora business owners and experts, for diaspora and Ghanaian small businesses." },
  { slug: "services", name: "Services", verb: "We coordinate, licensed partners deliver", first: "Business setup and soft landing", about: "Opening a business in Ghana from abroad, or settling in, with licensed partners. Questions on citizenship, residence or the Ghana Card go to Ghana's Diaspora Affairs Office or the Ministry of the Interior." },
];

export const PARTNER_DOORS = [
  { who: "Companies and investors", what: "Reach a diaspora that is ready to build in Ghana.", to: "/invest" },
  { who: "Institutions and NGOs", what: "Deliver programs with us, region by region.", to: "/partners" },
  { who: "Members offering skills", what: "Offer what you know where it is needed.", to: "/declare" },
  { who: "Ghana's regions and agencies", what: "Post what your district needs, and what it offers.", to: "/partners" },
] as const;

export const PARTNER_STEPS = [
  "Apply through the platform, or by invitation.",
  "Get vetted: licences, references, track record, and a site visit where it matters.",
  "Agree terms: service standards, member pricing and our complaints process.",
  "Get listed as a Region 17 Verified Partner on the regions you serve.",
  "Stay verified: reviewed every year.",
];

export const VISION = "A globally connected and empowered diaspora, united as a catalyst for investment, innovation, opportunity and sustainable development in Ghana and beyond.";
export const MISSION = "To connect, mobilize and empower Ghanaians and friends of Ghana worldwide, along with the wider African diaspora, through programs, events, resources, knowledge transfer and services that turn the diaspora's strength into measurable impact for Ghana.";

export const PILLARS = [
  ["Gather", "Bring the global diaspora together through membership, the platform and the Summit."],
  ["Honor", "Keep heritage and identity alive, region by region."],
  ["Advance", "Move enterprise and investment forward, starting with businesses set up the right way."],
  ["Nurture", "Grow knowledge and talent across borders."],
  ["Ally", "Work alongside partners, sponsors and Ghana's regions."],
] as const;

export const VALUES = [
  ["Unity", "One people, one purpose, wherever we live."],
  ["Impact", "From ideas to measurable results."],
  ["Integrity", "Trust is the foundation of every partnership."],
  ["Innovation", "Think globally, create boldly."],
  ["Partnership", "Progress is a shared responsibility."],
  ["Legacy", "Build for today, invest in tomorrow."],
] as const;

export const WE_ARE = [
  "A membership community for the diaspora, free to join",
  "A curator and coordinator of programs, events, resources, knowledge transfer and services",
  "A platform that shows what is happening in Ghana, region by region",
  "A network of partners we vet, who deliver to our standards",
];
export const WE_ARE_NOT = [
  "A government agency. We support national goals and work with institutions.",
  "A law firm, accountancy or travel agency. Licensed partners do that work.",
  "A broker. We take no fees on deals, investments or gifts.",
];

export const CONSTITUENCIES = [
  "Ghanaians abroad",
  "Ghanaians at home",
  "People of Ghanaian heritage",
  "The wider African diaspora and continental Africans",
  "Allies",
];

export const TEAM = [
  { name: "Maabena Webb", role: "Founder and Chief Executive Officer" },
  { name: "Rosca Sasu", role: "Co-Founder and Chief Operating Officer" },
];
