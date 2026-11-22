import { describe, expect, test } from "bun:test";
import { filterPress, PRESS_ARTICLES } from "../src/lib/press";

describe("press archive", () => {
  test("every supplied Chicago article remains in the archive", () => {
    expect(filterPress("SankofaOnline", "", "2026")).toHaveLength(4);
  });
  test("each article has its own unique permanent identifier", () => {
    expect(new Set(PRESS_ARTICLES.map((article) => article.slug)).size).toBe(PRESS_ARTICLES.length);
    for (const article of PRESS_ARTICLES) expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
  test("search matches publisher and filters combine", () => {
    expect(filterPress("  xinhua  ", "Diaspora context", "2025").map((article) => article.slug)).toEqual(["accra-diaspora-summit"]);
    expect(filterPress("xinhua", "Announcements", "2025")).toHaveLength(0);
  });
  test("archive sorts newest first", () => {
    const articles = filterPress("", "", "");
    expect(articles[0]?.date).toBe("2026-11-15");
    expect(articles.at(-1)?.date).toBe("2025-12-19");
  });
});