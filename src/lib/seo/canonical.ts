import { DEFAULT_LOCALE, LOCALE_HTML_LANG, LOCALES, type Locale } from "@/i18n";
import { localePath } from "@/i18n";

/**
 * The public origin, for the absolute URLs that only SEO needs.
 *
 * Everything a member clicks is a relative path built by `localePath()`. A
 * canonical link and an hreflang link are the exceptions: both are defined to
 * be absolute, and a relative one is either ignored or resolved against
 * whatever host happens to be serving, which on a preview branch is the wrong
 * answer written into a crawler's index.
 *
 * Read from the environment with a production fallback, matching
 * `siteUrl()` in `src/server/welcome.ts`. `VITE_` prefix because this runs in
 * the browser bundle too, unlike that one.
 */
export const SITE_ORIGIN: string =
  import.meta.env["VITE_SITE_URL"]?.trim() || "https://r17gh.com";

/** `https://r17gh.com/volta` for the default locale, `/fr/volta` prefixed. */
export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_ORIGIN}${localePath(locale, path)}`;
}

/**
 * The `<link>` set every indexable page carries: one canonical, one hreflang
 * per locale, and `x-default`.
 *
 * D-078: English is served unprefixed, so the canonical URL of a place is the
 * bare path. `hreflang="en"` and `hreflang="x-default"` both point at that same
 * unprefixed URL, which is the correct pairing when the default locale has no
 * prefix of its own: x-default names the page a crawler should serve when it
 * has no better language match, and here that is the English page.
 *
 * This is cheap now and expensive after the 5 October launch accumulates links,
 * which is why it ships with the URL change rather than after it.
 *
 * `path` is locale-free and starts with a slash: `/volta`, `/volta/adaklu`.
 */
export function canonicalLinks(
  locale: Locale,
  path: string,
): Array<{ rel: string; href: string; hrefLang?: string }> {
  const links: Array<{ rel: string; href: string; hrefLang?: string }> = [
    { rel: "canonical", href: absoluteUrl(locale, path) },
  ];

  for (const code of LOCALES) {
    links.push({
      rel: "alternate",
      hrefLang: LOCALE_HTML_LANG[code],
      href: absoluteUrl(code, path),
    });
  }

  // Same URL as the default locale's alternate, deliberately. Not a duplicate:
  // the two say different things to a crawler and both are expected.
  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: absoluteUrl(DEFAULT_LOCALE, path),
  });

  return links;
}
