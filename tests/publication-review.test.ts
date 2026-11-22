import { expect, test } from "bun:test";
import { publicationInput, publishSelectionInput } from "@/lib/publication-review";
import { filterPress, PRESS_ARTICLES } from "@/lib/press";
import { FEATURED_EVENT } from "@/lib/event";

test("publication only accepts known catalog slugs", () => {
  expect(publicationInput.safeParse({ slug: "diaspora-summit-joynews", state: "published" }).success).toBe(true);
  expect(publicationInput.safeParse({ slug: "invented-story", state: "published" }).success).toBe(false);
});
test("combined publishing validates question IDs and article selections", () => {
  expect(publishSelectionInput.safeParse({ questionIds: ["invalid"], articleSlugs: [] }).success).toBe(false);
  expect(publishSelectionInput.safeParse({ questionIds: [], articleSlugs: ["diaspora-summit-joynews"] }).success).toBe(true);
});
test("search cannot reintroduce coverage omitted by publication state", () => {
  const catalog = PRESS_ARTICLES.filter((a) => a.slug !== "diaspora-summit-joynews");
  expect(filterPress("JoyNews", "", "", catalog)).toHaveLength(0);
});
test("MOITI uses the owner-provided official address", () => {
  expect(FEATURED_EVENT.partners.find((p) => p.name === "Massachusetts Office of International Trade & Investment")?.url).toBe("https://www.mass.gov/orgs/massachusetts-office-of-international-trade-and-investment");
});