/**
 * Locale configuration. Exactly one locale is populated (English).
 * French arrives later as a translation project: add the code here, add the
 * dictionary file, nothing else changes.
 */
export const LOCALES = ["en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Human-readable names, in the language itself. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
};

/** BCP 47 tag for the html lang attribute. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
};

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Normalise a raw `{-$locale}` path param to a Locale.
 *
 * D-078 makes the locale segment optional, so the param is `string | undefined`
 * everywhere the router hands it over. Absent means the default locale, which
 * is the whole point of serving English unprefixed. An unknown value is NOT
 * silently defaulted: callers that can refuse (the locale layout's beforeLoad)
 * must 404 instead, so a mistyped locale never renders English at another
 * language's URL. This returns null for that case rather than guessing.
 */
export function resolveLocale(value: string | undefined): Locale | null {
  if (value === undefined) return DEFAULT_LOCALE;
  return isLocale(value) ? value : null;
}
