import { expect, test } from "bun:test";
import { execSync } from "node:child_process";

test("speaker bios PDF names both speakers", () => {
  const text = execSync("pdftotext public/downloads/speaker-bios.pdf -").toString();
  expect(text).toContain("H.E. Victor Emmanuel Smith");
  expect(text).toContain("Dr. Makeda Smith");
});
