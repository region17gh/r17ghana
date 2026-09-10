import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  Badge,
  ConfidenceFlag,
  SectionHeader,
} from "@/design-system/region-17-ghana-design-system-e3e62f";
import { DEFAULT_LOCALE, resolveLocale, useI18n } from "@/i18n";
import { regionPath } from "@/lib/places/path";
import { confidenceLevel, fetchRegionPayload, isPageBuilt } from "@/lib/region/payload";
import type { PayloadDistrict, RegionPayload } from "@/lib/region/payload";
import { absoluteUrl, canonicalLinks } from "@/lib/seo/canonical";

/**
 * A district page: `/volta/adaklu`.
 *
 * D-078 put place slugs flat in the top-level namespace, so this is the second
 * segment under a region and needs no `/regions/` or locale prefix. The address
 * is `places.url_path` verbatim, which is why `placePath()` takes that column
 * whole rather than assembling a region and a slug.
 *
 * WHAT THIS RENDERS. Only fields `region_payload(slug)` actually returns for
 * the district: name, capital, zone, summary, publication depth, and the
 * confidence and source citation attached to the row. There is no mock content
 * here and there should not be. The region page carries a documented block of
 * Volta-specific placeholder material; repeating that pattern 261 times is how
 * invented data reaches production under a real district's name.
 *
 * WHY IT 404s FOR EVERY DISTRICT TODAY, deliberately. `places.page_built` is
 * the switch that says a place's own page is built and safe to link to, and it
 * is false for all eighteen Volta districts. The route refuses an unbuilt
 * district rather than rendering a thin page at an address the region page also
 * declines to link to. That keeps the column meaning exactly what its comment
 * in the database says it means.
 *
 * Before this route existed, `page_built` could not be true for anything,
 * because the column's comment forbids setting it before a route serves the
 * place's url_path. Now it can: flipping it per district is what publishes
 * that district, once someone has written its content.
 */

const SUPPORTED_REGIONS = new Set(["volta"]);

export const Route = createFileRoute("/{-$locale}/$region/$district")({
  beforeLoad: ({ params }) => {
    if (!SUPPORTED_REGIONS.has(params.region)) throw notFound();
  },
  head: ({ params }) => {
    const path = `/${params.region}/${params.district}`;
    return {
      meta: [
        { title: "District | Region 17 Ghana" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: absoluteUrl(DEFAULT_LOCALE, path) },
      ],
      links: canonicalLinks(resolveLocale(params.locale) ?? DEFAULT_LOCALE, path),
    };
  },
  component: DistrictPage,
});

function DistrictPage() {
  const { t, locale } = useI18n();
  const { region: regionSlug, district: districtSlug } = Route.useParams();
  const [payload, setPayload] = useState<RegionPayload | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    setPayload(null);
    setFailure(null);
    void fetchRegionPayload(regionSlug)
      .then((p) => {
        if (live) setPayload(p);
      })
      .catch((err: unknown) => {
        // Same discipline as the region page: name the cause in the console and
        // on the page. A district page reached from a phone with no devtools
        // must not fail silently.
        console.error(
          `[district] ${regionSlug}/${districtSlug}: region payload failed to load`,
          err,
        );
        if (live) setFailure(err instanceof Error ? err.message : String(err));
      });
    return () => {
      live = false;
    };
  }, [regionSlug, districtSlug, attempt]);

  const district = useMemo<PayloadDistrict | null>(
    () => payload?.districts.find((d) => d.slug === districtSlug) ?? null,
    [payload, districtSlug],
  );

  if (failure !== null) {
    return (
      <main style={{ padding: "var(--space-20) var(--space-6)", textAlign: "center" }}>
        <p>{t("region.loadFailed")}</p>
        <p className="r17-cite" style={{ marginTop: "var(--space-3)" }}>
          {failure}
        </p>
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          style={{ marginTop: "var(--space-4)" }}
        >
          {t("region.loadRetry")}
        </button>
      </main>
    );
  }

  if (payload === null) {
    return (
      <main style={{ padding: "var(--space-20) var(--space-6)", textAlign: "center" }}>
        <p>{t("region.loading")}</p>
      </main>
    );
  }

  // Unknown slug, or a real district whose page is not built. Both are a 404
  // rather than a thin page: see the note at the top of this file.
  if (district === null || !isPageBuilt(district)) {
    return (
      <main style={{ padding: "var(--space-20) var(--space-6)", textAlign: "center" }}>
        <SectionHeader title={t("district.notBuilt.heading")} lede={t("district.notBuilt.lede")} />
        <p style={{ marginTop: "var(--space-6)" }}>
          <Link to={regionPath(locale, regionSlug)}>{t("district.notBuilt.backToRegion")}</Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: "var(--space-16) var(--space-6)" }}>
      <div className="r17-region-width" style={{ margin: "0 auto" }}>
        <p className="r17-cite" style={{ margin: "var(--space-0)" }}>
          <Link to={regionPath(locale, regionSlug)}>{payload.region?.name ?? regionSlug}</Link>
        </p>
        <SectionHeader
          eyebrow={district.zone ?? undefined}
          title={district.name}
          lede={district.summary ?? undefined}
        />
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            listStyle: "none",
            padding: "var(--space-0)",
            marginTop: "var(--space-6)",
          }}
        >
          {district.capital ? (
            <li>
              <Badge tone="neutral">{district.capital}</Badge>
            </li>
          ) : null}
          <li>
            <Badge tone="neutral">{district.depth}</Badge>
          </li>
          <li>
            <ConfidenceFlag level={confidenceLevel(district.data_confidence)} compact />
          </li>
        </ul>
        {district.reference_source ? (
          <p className="r17-cite" style={{ marginTop: "var(--space-6)" }}>
            {district.reference_source}
            {district.reference_verified ? ` · ${district.reference_verified}` : ""}
          </p>
        ) : null}
        {/* Safety control, not decoration. Its wording is fixed. */}
        <p className="r17-cite" style={{ marginTop: "var(--space-8)" }}>
          {t("legal.notAGovernmentDocument")}
        </p>
      </div>
    </main>
  );
}
