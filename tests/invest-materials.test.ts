import { expect, test } from "bun:test";
import { investMaterials } from "@/lib/invest-materials";

test("investor Q&A materials carry the trading rule and no-funds answer", () => {
  const m = investMaterials();
  expect(m).toContain("US$500,000");
  expect(m).toContain("never holds funds");
});
