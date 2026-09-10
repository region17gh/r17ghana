import { localePath, type Locale } from "@/i18n";

/**
 * Where a place lives in the URL.
 *
 * D-078, superseding the decision recorded here on 2026-09-01. Place slugs sit
 * FLAT in the top-level namespace: the region is `/volta` and a district is
 * `/volta/adaklu`. The `/regions/` collection segment is gone, and the locale
 * prefix is gone for English because the default locale is served unprefixed.
 *
 * Three things still hold from before, and all three are why this file exists
 * rather than the paths being assembled at each call site:
 *
 * 1. `places.url_path` is stored locale-free and prefix-free: `volta` for the
 *    region, `volta/ho-municipal` for a district, `volta/agotime-ziope/kpetoe`
 *    for a community. It is the place's address inside the place tree, not a
 *    URL. Never write a locale prefix into it; the prefix is produced here, at
 *    render time. Harness assertion D078.10 enforces that.
 * 2. The district identifier in that path is `places.slug`, never the design
 *    export's short id. `ho`, `keta` and `agotime` are retired.
 * 3. The flat namespace is shared with static routes like `/join` and
 *    `/signin`, so a place slug could collide with one. That is closed in the
 *    database by `public.reserved_slugs` and its two guard triggers, not by
 *    convention. See migration 20260902203812.
 */

/** `/volta` in English, `/fr/volta` in French. */
export function regionPath(locale: Locale, regionSlug: string): string {
  return localePath(locale, `/${regionSlug}`);
}

/**
 * `/volta/adaklu` in English, `/fr/volta/adaklu` in French.
 *
 * Takes `places.url_path` whole rather than a region and a slug, so the shape
 * of the path inside the place tree stays the database's to decide. A community
 * three levels deep needs no change here.
 *
 * The district route now exists, but the region page still only navigates here
 * for a district whose `page_built` is true. That column is false for all
 * eighteen Volta districts, so the spotlight sheet shows its not-yet-built
 * state instead of following the link. Flipping `page_built` is what publishes
 * a district page, and the column's own comment in the database says so.
 */
export function placePath(locale: Locale, urlPath: string): string {
  return localePath(locale, `/${urlPath}`);
}
