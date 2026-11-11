import { expect, test } from "bun:test";
import { investMaterials } from "@/lib/invest-materials";

test("investor Q&A materials carry the trading rule and no-funds answer", () => {
  const m = investMaterials();
  expect(m).toContain("US$500,000");
  expect(m).toContain("never holds funds");
});

import { pickLinks } from "@/lib/invest-materials";
test("investor helper links only to known pages, at most 3", () => {
  expect(pickLinks(["join", "evil", "form", "program", "live"]).map((l) => l.href)).toEqual(["/join", "#invest-form", "/program"].sort((a, b) => ["#invest-form","/join","/program"].indexOf(a) - ["#invest-form","/join","/program"].indexOf(b)));
  expect(pickLinks(["https://x.com"])).toEqual([]);
});
