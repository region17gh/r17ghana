import { expect, test } from "bun:test";
import { adminSignInOptions } from "@/lib/admin-access";

test("admin sign-in never creates new member accounts", () => {
  expect(adminSignInOptions("https://r17gh.com").shouldCreateUser).toBe(false);
});
test("admin magic links return to the same-origin public callback", () => {
  expect(adminSignInOptions("https://r17gh.com").emailRedirectTo).toBe("https://r17gh.com/admin");
  expect(adminSignInOptions("http://localhost:8080").emailRedirectTo).toBe("http://localhost:8080/admin");
});