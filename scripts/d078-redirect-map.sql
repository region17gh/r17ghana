-- D-078 legacy redirect map, generated from the live table.
--
-- Run against production (idmxottsjqeiatgiudvt) and export as CSV for
-- Cloudflare Bulk Redirects. See docs/d078-redirects.md first: the three
-- wildcard rules described there cover every one of these rows in one hop each,
-- and do not need regenerating when a place is added. This exhaustive list is
-- the belt-and-braces alternative, useful if you want per-place control or an
-- auditable record of exactly which addresses were redirected.
--
-- DO NOT filter on type_slug. An earlier version of this query used
--   where type_slug in ('region','district','community')
-- which returns 278 of 280 rows, silently dropping `ghana` (type_slug
-- 'country') and `agotime` (type_slug 'traditional-area', at
-- traditional/agotime). Both are real addressable places.

-- The old locale-first shape that was actually served: /en/regions/{url_path}.
select '/en/regions/' || url_path as from_path,
       '/' || url_path            as to_path,
       301                        as status
from public.places
union all
-- The locale-less form, for anything that circulated without the prefix.
select '/regions/' || url_path as from_path,
       '/' || url_path         as to_path,
       301                     as status
from public.places
union all
-- The bare locale-first place path, from before the /regions/ segment was
-- superseded: /en/volta.
select '/en/' || url_path as from_path,
       '/' || url_path    as to_path,
       301                as status
from public.places
order by from_path;
