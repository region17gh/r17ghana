import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { REGION_STRENGTHS } from "@/lib/invest/content";
import { REGIONS_ALPHABETICAL } from "@/lib/regions";
import { useStart } from "./InvestContext";

export function RegionExplorer() {
  const [slug, setSlug] = useState<string | null>(null);
  const start = useStart();
  const region = REGIONS_ALPHABETICAL.find((r) => r.slug === slug);
  const strengths = slug ? REGION_STRENGTHS[slug] : undefined;

  return (
    <div className="invest-stack-sm">
      <h3 className="invest-h3">Explore the 16 regions</h3>
      <div className="invest-chips invest-chips-scroll" role="group" aria-label="Ghana's 16 regions">
        {REGIONS_ALPHABETICAL.map((r) => (
          <button
            key={r.slug}
            type="button"
            className="invest-chip"
            aria-pressed={slug === r.slug}
            aria-controls="region-panel"
            onClick={() => setSlug(slug === r.slug ? null : r.slug)}
          >
            <span className="invest-dot" style={{ background: `var(${r.token})` }} aria-hidden="true" />
            {r.name}
          </button>
        ))}
      </div>
      <div id="region-panel" aria-live="polite">
        {region ? (
          <Card accent={`var(${region.token})`}>
            <p className="r17-eyebrow invest-ink">{region.name} Region</p>
            <p className="invest-card-text">Capital: {region.capital}</p>
            <p className="invest-card-text">
              {strengths ? `Strengths: ${strengths.join(", ")}` : "Profile coming soon"}
            </p>
            <div className="invest-actions">
              <Button variant="primary" size="lg" onClick={() => start({ region: region.slug })}>
                I'm interested in this region
              </Button>
            </div>
          </Card>
        ) : (
          <p className="invest-cite">Choose a region to see its capital and strengths.</p>
        )}
      </div>
    </div>
  );
}
