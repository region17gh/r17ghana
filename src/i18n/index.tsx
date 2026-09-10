import { createContext, useContext, useMemo, type ReactNode } from "react";

import { DEFAULT_LOCALE, type Locale } from "./config";
import { translator, type Translate } from "./translate";

export * from "./config";
export { translator, type Translate } from "./translate";

interface I18nValue {
  locale: Locale;
  t: Translate;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  // One implementation, shared with the server. See i18n/translate.ts.
  const value = useMemo<I18nValue>(() => ({ locale, t: translator(locale) }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>. Locale routes provide it.");
  }
  return value;
}

/** Convenience: const t = useT(); t("join.title") */
export function useT(): Translate {
  return useI18n().t;
}

/**
 * Build the address a place or page actually lives at.
 *
 * D-078: the default locale is served unprefixed, so `localePath("en", "/join")`
 * is `/join`, not `/en/join`. A non-default locale keeps its prefix:
 * `localePath("fr", "/join")` is `/fr/join`.
 *
 * Every internal link goes through here. No locale segment is concatenated by
 * hand anywhere in the codebase, which is what stops a stray `/en/` appearing
 * in an href and bouncing through a redirect on every navigation.
 */
export function localePath(locale: Locale, path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return suffix;
  return `/${locale}${suffix === "/" ? "" : suffix}`;
}
