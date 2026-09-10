import { createFileRoute } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_LOCALE } from "@/i18n";
import { absoluteUrl } from "@/lib/seo/canonical";

/**
 * `/sitemap.xml`, generated from `places.url_path`.
 *
 * D-078: every URL here is unprefixed, because English is served at the root.
 * The paths come from the database rather than from a hardcoded list, so the
 * sitemap cannot drift from the 280 places that exist. `url_path` is stored
 * locale-free and prefix-free, and `absoluteUrl` adds the origin and (for a
 * non-default locale) the prefix.
 *
 * ONLY PUBLISHED, PAGE-BUILT PLACES ARE LISTED, and the two filters do
 * different jobs. `is_published` is the register's own visibility switch, and
 * RLS enforces it for this anonymous read anyway. `page_built` is whether a
 * route actually serves the place's own address: it is false for every district
 * today, and listing one would hand a crawler a URL that answers 404. A sitemap
 * full of 404s is worse than a short sitemap.
 *
 * The region index and the static entry points are listed explicitly because
 * they are routes, not places.
 */

const STATIC_PATHS = ["/", "/join", "/join/register"] as const;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await supabase
          .from("places")
          .select("url_path, updated_at")
          .eq("is_published", true)
          .eq("page_built", true)
          .order("url_path");

        if (error) {
          // Say why, and do not serve a silently short sitemap: an empty
          // sitemap that returns 200 tells a crawler the site has three pages.
          console.error("[sitemap] places query failed", error);
          return new Response("sitemap unavailable\n", {
            status: 503,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        const entries = [
          ...STATIC_PATHS.map((path) => ({ loc: absoluteUrl(DEFAULT_LOCALE, path), lastmod: null as string | null })),
          ...(data ?? []).map((row) => ({
            loc: absoluteUrl(DEFAULT_LOCALE, `/${row.url_path}`),
            lastmod: typeof row.updated_at === "string" ? row.updated_at.slice(0, 10) : null,
          })),
        ];

        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map((entry) =>
            [
              "  <url>",
              `    <loc>${xmlEscape(entry.loc)}</loc>`,
              ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
              "  </url>",
            ].join("\n"),
          ),
          "</urlset>",
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            // Places change rarely; a crawler re-reading this hourly is waste.
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
