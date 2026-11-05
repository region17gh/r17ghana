import { SectionHeader } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { INCENTIVES } from "@/lib/invest/content";
import { RegionExplorer } from "./RegionExplorer";

export function Opportunity() {
  return (
    <section aria-labelledby="outside-accra" className="invest-section">
      <div className="invest-wrap invest-stack">
        <SectionHeader
          eyebrow="The opportunity is outside Accra"
          title={<span id="outside-accra">Most investment stops in Accra. The incentives don't.</span>}
          lede="In 2025, 143 of 181 newly registered foreign investment projects went to Greater Accra. Ghana rewards investors who build in the regions."
        />
        <div className="invest-grid-4">
          {INCENTIVES.map((i) => (
            <div key={i.figure} className="invest-item">
              <p className="invest-figure">{i.figure}</p>
              <p className="invest-card-text">{i.text}</p>
            </div>
          ))}
        </div>
        <RegionExplorer />
      </div>
    </section>
  );
}
