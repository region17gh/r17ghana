import { expect, test } from "bun:test";
import { previewQuestions } from "@/lib/publication-preview";

test("preview stages a question without publishing or modifying the live list", () => {
  const live = [{ id: "live", question: "Which sectors are covered?" }];
  const selected = [{ id: "pending", question: "What time does the roundtable begin?" }];
  expect(previewQuestions(live, selected).map((item) => item.id)).toEqual(["live", "pending"]);
  expect(live.map((item) => item.id)).toEqual(["live"]);
  expect(selected.map((item) => item.id)).toEqual(["pending"]);
});
test("preview does not duplicate an already approved question", () => {
  const question = { id: "approved", question: "Where is the event?" };
  expect(previewQuestions([question], [question])).toEqual([question]);
});