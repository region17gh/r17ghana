import { expect, test } from "bun:test";
import { bostonQuestionInput, bostonReviewInput } from "@/lib/boston-question";
import { requireOperator } from "@/lib/invest-question";

test("publication requires affirmative permission", () => {
  expect(bostonQuestionInput.safeParse({ question: "What sectors are being discussed?", publicationPermission: false }).success).toBe(false);
  expect(bostonQuestionInput.safeParse({ question: "What sectors are being discussed?", publicationPermission: true }).success).toBe(true);
});
test("questions must contain 3 to 500 characters after trimming", () => {
  expect(bostonQuestionInput.safeParse({ question: " a ", publicationPermission: true }).success).toBe(false);
  expect(bostonQuestionInput.safeParse({ question: "a".repeat(501), publicationPermission: true }).success).toBe(false);
  expect(bostonQuestionInput.parse({ question: " abc ", publicationPermission: true }).question).toBe("abc");
});
test("review actions require existing operator permission", () => {
  expect(() => requireOperator(false)).toThrow();
  expect(() => requireOperator(null)).toThrow();
  expect(() => requireOperator(true, true)).toThrow();
  expect(() => requireOperator(true)).not.toThrow();
});
test("only supported moderation states are accepted", () => {
  expect(bostonReviewInput.safeParse({ id: "e885a213-94e8-4c99-b07b-924b3bfc61d7", state: "approved" }).success).toBe(true);
  expect(bostonReviewInput.safeParse({ id: "e885a213-94e8-4c99-b07b-924b3bfc61d7", state: "public" }).success).toBe(false);
});