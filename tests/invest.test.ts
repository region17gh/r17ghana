import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { validate1 } from "@/hooks/useInvestForm";
import en from "@/i18n/locales/en.json";
import { INVEST_FORM_HASH, opensInvestForm } from "@/lib/invest/hash";
import { CONNECTIONS, INVESTOR_TYPES, ORG_LINE, SECTORS, SUPPORT, TICKETS, TIMELINES } from "@/lib/invest/content";

// These lists must match the CHECK constraints on public.investor_interests.
describe("invest form options match the database", () => {
  test("investor types", () => {
    expect(INVESTOR_TYPES.map((o) => o.value)).toEqual(["individual", "business_owner", "investor_group", "institution", "ghana_project"]);
  });
  test("amounts", () => {
    expect(TICKETS.map((o) => o.value)).toEqual(["under_25k", "25k_100k", "100k_500k", "500k_2m", "over_2m", "not_sure"]);
  });
  test("timelines", () => {
    expect(TIMELINES.map((o) => o.value)).toEqual(["exploring", "12_months", "6_months", "already_investing"]);
  });
  test("ten sectors and five kinds of help", () => {
    expect(SECTORS).toHaveLength(10);
    expect(SUPPORT.map((o) => o.value)).toEqual(["information", "introductions", "delegation", "setup", "project_review"]);
  });
  test("reuses the six member connection types", () => {
    expect(CONNECTIONS.map((o) => o.value)).toEqual(["ghanaian_abroad", "ghanaian_heritage", "african_diaspora", "ghanaian_at_home", "african_continental", "ally"]);
  });
});

describe("invest wording", () => {
  test("partnership, not initiative, and never a government body", () => {
    expect(ORG_LINE).toContain("in partnership with the Embassy of Ghana");
    expect(ORG_LINE).not.toContain("initiative");
    expect(ORG_LINE).toContain("not a government body");
  });
});

describe("step 1 validation", () => {
  const ok = { fullName: "Ama Mensah", email: "ama@example.com", country: "Ghana", connection: "ally" as const, investorType: "individual" as const, consent: true, website: "" };
  test("complete step passes", () => expect(validate1(ok)).toEqual({}));
  test("consent is required", () => expect(validate1({ ...ok, consent: false }).consent).toBeDefined());
  test("bad email is rejected", () => expect(validate1({ ...ok, email: "ama@" }).email).toBeDefined());
});

// A visitor who is not told the address cannot ask for it, so the invest page
// has to be reachable by selecting something on the home page.
describe("invest page is reachable without typing the address", () => {
  test("the home page carries the invitation and the footer", () => {
    const home = readFileSync("src/routes/{-$locale}/index.tsx", "utf8");
    expect(home).toContain("<InvestInvite />");
    expect(home).toContain("<SiteFooter />");
  });

  test("both doors build the address through localePath", () => {
    const invite = readFileSync("src/components/landing/InvestInvite.tsx", "utf8");
    const footer = readFileSync("src/components/site/SiteFooter.tsx", "utf8");
    expect(invite).toContain('localePath(locale, "/invest")');
    expect(footer).toContain('localePath(locale, "/invest")');
  });

  test("the footer names the invest link", () => {
    expect(en.nav.invest).toBe("Invest in Ghana");
    expect(en.footer.tagline).toBe("One Nation. One Global Diaspora. One Shared Vision.");
  });
});

// The printed QR code encodes one address, so that address must be the form's own.
describe("the investor form has its own address", () => {
  test("the address is the form section's anchor", () => {
    expect(INVEST_FORM_HASH).toBe("#invest-form");
    const form = readFileSync("src/components/invest/InvestForm.tsx", "utf8");
    expect(form).toContain('id="invest-form"');
  });

  test("only that fragment opens the form", () => {
    expect(opensInvestForm("#invest-form")).toBe(true);
    expect(opensInvestForm("#faq")).toBe(false);
    expect(opensInvestForm("")).toBe(false);
  });

  test("the page opens the form when the address asks for it", () => {
    const form = readFileSync("src/components/invest/InvestForm.tsx", "utf8");
    expect(form).toContain("opensInvestForm(window.location.hash)");
    expect(form).toContain("f.open()");
  });
});
