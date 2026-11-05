import { Statistic } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { STATS } from "@/lib/invest/content";

export function StatStrip() {
  return (
    <section aria-labelledby="why-now" className="invest-section invest-paper">
      <div className="invest-wrap">
        <h2 id="why-now" className="r17-eyebrow invest-ink">Why now</h2>
        <div className="invest-stats">
          {STATS.map((s) => (
            <Statistic key={s.label} value={s.value} unit={s.unit} label={s.label} year={s.year} source={s.source} confidence="estimate" />
          ))}
        </div>
        <p className="invest-cite">Sources: GIPA, Bank of Ghana, Fitch Ratings.</p>
      </div>
    </section>
  );
}
