# D-078 legacy redirects

English is now served unprefixed and place slugs are flat, so three older URL
shapes have to keep resolving:

| Old shape | Example | Now |
| --- | --- | --- |
| locale-first, with the collection segment | `/en/regions/volta` | `/volta` |
| locale-first, bare place path | `/en/volta` | `/volta` |
| locale-less, with the collection segment | `/regions/volta` | `/volta` |

Plus every non-place page that carried the prefix: `/en/join`, `/en/signin`,
`/en/verify`, `/en/home`, `/en/declare`, `/en/join/register`, and `/en` itself.

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

Also add, as its own rule because it has no path to substitute:

| Match | Target | Status |
| --- | --- | --- |
| `/en` | `/` | 301 |

That is the whole set. It covers the static pages as well as the places,
because `/en/join` and `/en/volta` are the same shape to rule 3.

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
