import { describe, expect, test } from "bun:test";
import { investorQuestionInput, requireOperator, replyInput } from "../src/lib/invest-question";

describe("private investor questions", () => {
  test("email is optional", () => expect(investorQuestionInput.parse({ question: "Which sectors?" }).email).toBe(""));
  test("email requires explicit reply permission", () => expect(() => investorQuestionInput.parse({ question: "Which sectors?", email: "guest@example.com" })).toThrow());
  test("a permissioned email is accepted", () => expect(investorQuestionInput.parse({ question: "Which sectors?", email: "guest@example.com", replyPermission: true }).email).toBe("guest@example.com"));
  test("non-operators are refused", () => expect(() => requireOperator(false)).toThrow());
  test("role lookup failures deny access", () => expect(() => requireOperator(true, true)).toThrow());
  test("reply caller cannot choose recipient", () => expect(replyInput.parse({ id: "12345678-1234-4234-8234-123456789abc", body: "Thank you.", to: "other@example.com" })).not.toHaveProperty("to"));
});