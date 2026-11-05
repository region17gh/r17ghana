import { Reveal } from "@/components/charter/Reveal";
import { SectionHeader } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { INCENTIVES } from "@/lib/invest/content";
import { RegionExplorer } from "./RegionExplorer";

export function Opportunity() {
  return (
    <section aria-labelledby="outside-accra" className="invest-section">
      <Reveal className="invest-wrap invest-stack">
        <SectionHeader
          eyebrow="The opportunity is outside Accra"
          title={<span id="outside-accra">Most investment stops in Accra. The incentives don't.</span>}
          lede="In 2025, 143 of 181 new foreign projects went to Greater Accra."
        />
        <div className="invest-grid-4">
          {INCENTIVES.map((i, n) => (
            <div key={i.figure} className="invest-item invest-rise" style={{ ["--charter-i" as string]: n }}>
              <p className="invest-figure">{i.figure}</p>
              <p className="invest-card-text">{i.text}</p>
            </div>
          ))}
        </div>
        <RegionExplorer />
      </Reveal>
    </section>
  );
}
