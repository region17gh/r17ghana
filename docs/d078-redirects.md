# D-078 legacy redirects

English is now served unprefixed and place slugs are flat, so three older URL
shapes have to keep resolving:

| Old shape | Example | Now | Without a rule |
| --- | --- | --- | --- |
| locale-first, with the collection segment | `/en/regions/volta` | `/volta` | **404** |
| locale-first, bare place path | `/en/volta` | `/volta` | **404** |
| locale-less, with the collection segment | `/regions/volta` | `/volta` | **404** |
| locale-suffix form | `/join/en` | `/join` | **404** |
| locale-less registration | `/register` | `/join/register` | **404** |
| locale root | `/en` | `/` | **404** |
| locale-first static page | `/en/join` | `/join` | serves, non-canonically |

The last row differs from the rest and the difference is worth knowing. `/en/join`
still resolves, because `join` is a static segment so the optional locale segment
absorbs `en` and the page renders as `locale: "en"`. It serves **duplicate content
at a non-canonical URL** rather than 404ing. The canonical tag limits the SEO
damage, but rule 3 below is what actually fixes it.

Every other row 404s until its rule exists, which is why these are not optional
cleanup. Two of them are addresses that were in active circulation:

- **`/join/en` is the address printed on launch material.** The retired
  `src/lib/charter/legacyPaths.ts` said so explicitly: "This is the address
  printed on launch material, so it is the one that most needs to keep
  resolving." Its route stub was deleted with the rest of the locale-first
  redirect table, so it now matches `$region/$district` as
  `{region: "join", district: "en"}` and fails the region guard.
- **`/register`** was the locale-less registration path. It now matches
  `$region` as `{region: "register"}` and fails the same guard.

Neither is covered by a wildcard rule, because neither is a prefix shape. They
need the two exact-match rules in the second table below.

These 301 at the edge, never in client code. There is no custom Worker entry in
`wrangler.jsonc` and D-078's routing change does not add one.

## Recommended: three wildcard Single Redirect rules

Cloudflare Single Redirects support wildcard matching with `${1}` substitution.
Three rules cover every case above, in one hop each, and never need
regenerating when a place is added:

| Order | Match | Target | Status |
| --- | --- | --- | --- |
| 1 | `/en/regions/*` | `/${1}` | 301 |
| 2 | `/regions/*` | `/${1}` | 301 |
| 3 | `/en/*` | `/${1}` | 301 |

Order matters and rule 1 must come first. With rule 3 evaluated first,
`/en/regions/volta` would become `/regions/volta` and need a second hop through
rule 2. Two 301s in a chain still resolve, but they halve the link equity that
survives and they show up as a redirect chain in every audit tool.

Then these three exact-match rules, which have no path to substitute and are
**not** covered by any wildcard above:

| Match | Target | Status | Why |
| --- | --- | --- | --- |
| `/en` | `/` | 301 | locale root |
| `/join/en` | `/join` | 301 | **printed on launch material** |
| `/register` | `/join/register` | 301 | locale-less registration path |

That is the whole set: three wildcards plus three exact matches. The wildcards
cover the static pages as well as the places, because `/en/join` and `/en/volta`
are the same shape to rule 3.

`/join/en` is the one to create first. It is the only address here that appears
on material already in people's hands, and it is 404ing now.

## Alternative: the exhaustive list

`scripts/d078-redirect-map.sql` generates one row per place per old shape, from
`public.places`, for import as Cloudflare Bulk Redirects. Run it against
production and export the result as CSV.

Prefer the wildcard rules. The exhaustive list is worth having only if you want
per-place control, or an auditable record of exactly which addresses were
redirected on the day of the cutover. It has one real drawback: it goes stale
the moment a place is added, and nothing warns you.

**The CSV is deliberately not committed here.** It would be a 280-row snapshot
of a table that is the actual source of truth, and a committed copy is a second
source of truth that can silently disagree with the first. Generate it when you
need it.

## Verifying after the cutover

Check one of each shape, and check that each is a single hop:

```
curl -sSI https://r17gh.com/en/regions/volta | grep -i '^location'   # -> /volta
curl -sSI https://r17gh.com/regions/volta    | grep -i '^location'   # -> /volta
curl -sSI https://r17gh.com/en/volta         | grep -i '^location'   # -> /volta
curl -sSI https://r17gh.com/en/join          | grep -i '^location'   # -> /join
curl -sSI https://r17gh.com/en               | grep -i '^location'   # -> /
curl -sSI https://r17gh.com/join/en          | grep -i '^location'   # -> /join
curl -sSI https://r17gh.com/register         | grep -i '^location'   # -> /join/register
```

If any of them returns two `Location` hops, the rule order is wrong.

## Why the router does not do this

`/en/volta` does not reach the locale route at all. `$region` is a sibling in
the same flat namespace and TanStack ranks filling a required param above using
an optional one, so `/en/volta` matches `$region/$district` as
`{region: "en", district: "volta"}` and fails the region guard with a 404.

That fails safe: without these redirects a legacy URL 404s rather than serving
the wrong page. But it does mean the redirects are the only thing making those
addresses work, so they are not optional cleanup.

The one exception is a locale prefix in front of a STATIC segment. `/en/join`
does reach the locale route as `{locale: "en"}`, because a static sibling does
not shadow the optional segment the way `$region` does. So `/en/...` place paths
404 while `/en/...` static pages serve duplicate content. Rule 3 covers both.
