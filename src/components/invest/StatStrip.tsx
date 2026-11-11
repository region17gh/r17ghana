import { Card, Statistic } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { Reveal } from "@/components/charter/Reveal";
import { STATS, WHY_NOW } from "@/lib/invest/content";

export function StatStrip() {
  return (
    <Reveal as="section" className="invest-section invest-paper why-now">
      <div className="invest-wrap why-now-grid">
        <div className="why-now-lead charter-fade">
          <h2 id="why-now" className="r17-eyebrow why-now-eyebrow">Why now</h2>
          <p className="why-now-title">{WHY_NOW.title}</p>
          <p className="why-now-lede">{WHY_NOW.lede}</p>
          <p className="invest-cite">Sources: GIPA, Bank of Ghana, Fitch Ratings.</p>
        </div>
        <ol className="why-now-stats" aria-labelledby="why-now">
          {STATS.map((s, i) => (
            <li key={s.label} className="why-now-item charter-fade" style={{ ["--charter-i" as string]: i + 1 }}>
              <Card className="why-now-card">
                <span className="why-now-num" aria-hidden="true">0{i + 1}</span>
                <Statistic
                  className="why-now-stat"
                  size="lg"
                  value={s.value}
                  unit={s.unit}
                  label={s.label}
                  year={s.year}
                  source={s.source}
                  confidence="estimate"
                />
                <p className="why-now-signal">{s.signal}</p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
