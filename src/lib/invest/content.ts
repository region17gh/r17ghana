/**
 * Copy and option sets for the /invest page.
 *
 * Option `value`s must match the CHECK constraints on public.investor_interests;
 * tests/invest.test.ts holds them together. Figures are placeholders from GIPA,
 * Bank of Ghana and Fitch, flagged "estimate" until verified before launch.
 */
import type { ConnectionType } from "@/lib/join/options";

export interface Option<V extends string = string> {
  value: V;
  label: string;
}

export const ORG_LINE =
  "R17GH is a US 501(c)(3) nonprofit working in partnership with the Embassy of Ghana to the United States. It is not a government body.";

export const STATS = [
  { value: "5.0", unit: "%", label: "Inflation, August 2026", year: 2026, source: "Bank of Ghana" },
  { value: "B", unit: "Positive", label: "Fitch sovereign rating, upgraded May 2026", year: 2026, source: "Fitch Ratings" },
  { value: "US$12.9", unit: "B", label: "International reserves, June 2026", year: 2026, source: "Bank of Ghana" },
  { value: "US$2.62", unit: "B", label: "Foreign direct investment recorded in 2025", year: 2025, source: "GIPA" },
];

export const INCENTIVES = [
  { figure: "Up to 50%", text: "Tax rebate for factories located outside Accra and Tema" },
  { figure: "12.5%", text: "Corporate tax for manufacturing in rural areas (18.75% in regional capitals)" },
  { figure: "1% for 5 years", text: "Corporate tax for agro-processing" },
  { figure: "1% for 10 years", text: "Corporate tax for tree crop and cattle farming" },
];

export const REGION_STRENGTHS: Record<string, string[]> = {
  volta: ["Agribusiness", "Agro-processing", "Renewable energy"],
  western: ["Oil and gas", "Mining services"],
  eastern: ["Manufacturing", "Agriculture"],
  ashanti: ["Manufacturing", "Trade"],
  "greater-accra": ["Services", "Digital economy", "Manufacturing"],
};

export const LAW_CARDS = [
  {
    title: "No general minimum capital",
    body: "The GIPA Act 2026 removed the general minimum foreign capital requirement for joint ventures and wholly foreign-owned companies.",
  },
  {
    title: "Know the trading rule",
    body: "Businesses that buy and resell goods still need US$500,000 in cash equity and a team that is at least 75% skilled Ghanaians. This applies even to Ghanaian-owned companies with a foreign director or owner. We'll help you structure around it.",
    alert: "Diaspora alert",
  },
  {
    title: "Registered in 5 working days",
    body: "With a 24-hour expedited option, investment guarantees against expropriation, and the right to transfer profits and dividends.",
  },
];

export const STEPS = [
  { title: "Tell us your goals", body: "Two minutes. What you want to build, where, and at what scale." },
  { title: "We map the fit", body: "Region, sector, incentives and the rules that apply to you." },
  { title: "We make the introductions", body: "Project promoters, regional investment offices, advisers and diaspora partners." },
  { title: "We help you land", body: "Diaspora Delegations to Ghana and hands-on business setup." },
];

export type SectorValue =
  | "agriculture" | "manufacturing" | "energy" | "mining" | "infrastructure"
  | "real_estate" | "digital" | "tourism" | "health" | "education" | "other";

export const SECTORS: Array<Option<SectorValue> & { icon: string; body: string }> = [
  { value: "agriculture", label: "Agriculture and agro-processing", icon: "sprout", body: "Commercial farming, irrigation, storage, cold chain, food processing." },
  { value: "manufacturing", label: "Manufacturing", icon: "factory", body: "Automotive components, textiles, packaging, export production." },
  { value: "energy", label: "Energy and green transition", icon: "zap", body: "Power, renewables, storage, oil and gas services." },
  { value: "mining", label: "Mining and critical minerals", icon: "pickaxe", body: "Processing and value addition in aluminium, manganese, lithium, iron and steel." },
  { value: "infrastructure", label: "Infrastructure and logistics", icon: "truck", body: "Roads, ports, industrial zones, warehousing." },
  { value: "real_estate", label: "Real estate and housing", icon: "building-2", body: "Residential, commercial and mixed-use development." },
  { value: "digital", label: "Digital economy and fintech", icon: "cpu", body: "Data centres, payments, AI and tech-enabled services." },
  { value: "tourism", label: "Tourism and creative economy", icon: "palmtree", body: "Hospitality, eco-tourism, film and creative industries." },
  { value: "health", label: "Health and pharmaceuticals", icon: "heart-pulse", body: "Healthcare facilities, pharmaceutical production, medical supplies." },
  { value: "education", label: "Education and skills", icon: "graduation-cap", body: "Schools, technical training, workforce development." },
];

export const SECTOR_OTHER: Option<SectorValue> = { value: "other", label: "Other" };

export const CONNECTIONS: Option<ConnectionType>[] = [
  { value: "ghanaian_abroad", label: "Ghanaian abroad" },
  { value: "ghanaian_heritage", label: "Ghanaian heritage" },
  { value: "african_diaspora", label: "African diaspora" },
  { value: "ghanaian_at_home", label: "Ghanaian at home" },
  { value: "african_continental", label: "African continental" },
  { value: "ally", label: "Ally" },
];

export type InvestorType = "individual" | "business_owner" | "investor_group" | "institution" | "ghana_project";

export const INVESTOR_TYPES: Option<InvestorType>[] = [
  { value: "individual", label: "An individual investor" },
  { value: "business_owner", label: "A business owner looking to set up or expand in Ghana" },
  { value: "investor_group", label: "Part of an investor group, angel network or syndicate" },
  { value: "institution", label: "An institution, fund or family office" },
  { value: "ghana_project", label: "A Ghana-based project seeking investment" },
];

export const TICKETS: Option[] = [
  { value: "under_25k", label: "Under 25K" },
  { value: "25k_100k", label: "25K to 100K" },
  { value: "100k_500k", label: "100K to 500K" },
  { value: "500k_2m", label: "500K to 2M" },
  { value: "over_2m", label: "Over 2M" },
  { value: "not_sure", label: "Not sure yet" },
];

export const TIMELINES: Option[] = [
  { value: "exploring", label: "Just exploring" },
  { value: "12_months", label: "Within 12 months" },
  { value: "6_months", label: "Within 6 months" },
  { value: "already_investing", label: "Already investing in Ghana" },
];

export const SUPPORT: Option[] = [
  { value: "information", label: "Market and regulatory information" },
  { value: "introductions", label: "Introductions to projects or partners" },
  { value: "delegation", label: "A visit or delegation to Ghana" },
  { value: "setup", label: "Business setup and registration" },
  { value: "project_review", label: "A review of my project" },
];

export const ANY_REGION: Option = { value: "any", label: "Open to any region" };

export const FAQ = [
  { q: "Do I need to be Ghanaian to invest?", a: "No. R17GH works with the whole African diaspora and its allies. Some rules differ by nationality and business type, and we'll walk you through the ones that apply to you." },
  { q: "Is there a minimum amount?", a: "Not for most businesses under the 2026 law. Trading businesses are the main exception. Tell us your plans and we'll be specific." },
  { q: "Does R17GH take or manage my money?", a: "No. R17GH never holds funds and does not sell investments. We connect you with the people, projects and institutions that do." },
  { q: "Is R17GH a government agency?", a: "No. R17GH is a US 501(c)(3) nonprofit working in partnership with the Embassy of Ghana to the United States. We have no say over any government decision or approval." },
  { q: "What happens after I submit?", a: "A member of the R17GH team reviews your details and replies personally, usually within three business days." },
];
