import farm from "@/assets/invest/northern-farmland.webp";
import farmSm from "@/assets/invest/northern-farmland-800.webp";
import { Button } from "@/components/ui/Button";
import { Badge, SectionHeader } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { LAW_CARDS } from "@/lib/invest/content";
import { useStart } from "./InvestContext";

export function LawCards() {
  return (
    <section aria-labelledby="law-2026" className="invest-section invest-paper">
      <div className="invest-wrap invest-stack">
        <SectionHeader eyebrow="What changed in 2026" title={<span id="law-2026">Ghana's new investment law, in plain terms.</span>} />
        <div className="invest-grid-3">
          {LAW_CARDS.map((c) => (
            <div key={c.title} className="invest-item">
              {c.alert ? <Badge tone="gold">{c.alert}</Badge> : null}
              <h3 className="invest-h3">{c.title}</h3>
              <p className="invest-card-text">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DiasporaGap() {
  const start = useStart();
  return (
    <section aria-labelledby="gap" className="invest-gap">
      <img className="invest-band-img" src={farm} srcSet={`${farmSm} 800w, ${farm} 1600w`} sizes="100vw"
        width={1600} height={912} loading="lazy" alt="Irrigated farmland in Ghana's northern savannah" />
      <div className="invest-hero-scrim" aria-hidden="true" />
      <div className="invest-wrap invest-gap-body">
        <h2 id="gap" className="invest-gap-title">The diaspora sends money home. Very little of it becomes registered investment.</h2>
        <p className="invest-hero-sub">
          In 2025, the United States accounted for 4 registered projects in Ghana and the United Kingdom for 8. R17GH exists to change that number.
        </p>
        <div className="invest-actions">
          <Button variant="gold" size="lg" onClick={() => start()}>Be part of it</Button>
        </div>
      </div>
    </section>
  );
}
