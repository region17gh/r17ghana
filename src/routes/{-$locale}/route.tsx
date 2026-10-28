import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

import { I18nProvider, resolveLocale } from "@/i18n";

/**
 * Locale layout for every member-facing page.
 *
 * D-078: the locale segment is OPTIONAL (`{-$locale}`). English is served
 * unprefixed, so `/volta` and `/join` are canonical and there is no visible
 * `/en`. The locale is still resolved here and still provided to the tree, so
 * every `t()` key keeps working and D-041's i18n scaffolding requirement holds.
 *
 * A NOTE ON WHAT ACTUALLY REACHES `params.locale`, verified against
 * @tanstack/react-router 1.170.16 rather than assumed:
 *
 * the segment is currently unreachable. `$region` sits as a sibling in the
 * same flat namespace, and TanStack ranks filling a required param above using
 * an optional one, at every depth. `/en` matches `$region` with region="en",
 * not this route with locale="en"; `/fr/volta` matches `$region/$district`
 * with region="fr". A `params.parse` that rejects non-locales does not change
 * this, because matching is structural and resolved before params are parsed.
 *
 * So `params.locale` is always undefined today, and the fallback below is the
 * live path, not a defensive branch. That is harmless while LOCALES holds only
 * `en`: the default is never in a URL, so nothing is lost. It does mean a
 * PREFIXED locale cannot be served by this route tree. When a second language
 * ships, `/fr/...` needs a rewrite ahead of the router (the segment stripped
 * and the locale carried separately) rather than another route file. That is a
 * decision for when French is real; writing it down here so it is not
 * rediscovered as a bug.
 *
 * The fallback is still guarded rather than trusted: an unknown segment is a
 * 404, never a silent render of English at another language's URL.
 */
export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    const locale = resolveLocale(params.locale);
    if (locale === null) throw notFound();
    return { locale };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale: raw } = Route.useParams();
  const locale = resolveLocale(raw);
  if (locale === null) return null;

  return (
    <I18nProvider locale={locale}>
      {/* Nested locale routes render here. */}
      <Outlet />
    </I18nProvider>
  );
}
