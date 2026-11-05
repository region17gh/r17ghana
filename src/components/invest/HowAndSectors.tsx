import port from "@/assets/invest/western-coast-port.webp";
import portSm from "@/assets/invest/western-coast-port-800.webp";
import { Icon, SectionHeader } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { SECTORS, STEPS } from "@/lib/invest/content";
import { useStart } from "./InvestContext";

export function HowItWorks() {
  return (
    <section aria-labelledby="how" className="invest-section">
      <div className="invest-wrap invest-stack">
        <SectionHeader eyebrow="How R17GH works with you" title={<span id="how">Four steps, one team.</span>} />
        <ol className="invest-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="invest-step">
              <span className="invest-step-num r17-num">{i + 1}</span>
              <h3 className="invest-h3">{s.title}</h3>
              <p className="invest-card-text">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="invest-cite">R17GH does not hold funds or sell securities. We inform, connect and facilitate.</p>
      </div>
    </section>
  );
}

export function Sectors() {
  const start = useStart();
  return (
    <section aria-labelledby="sectors" className="invest-section invest-paper">
      <div className="invest-wrap invest-stack">
        <img className="invest-inline-img" src={port} srcSet={`${portSm} 800w, ${port} 1600w`}
          sizes="(min-width: 1280px) 1200px, 100vw" width={1600} height={912} loading="lazy"
          alt="The port at Takoradi with fishing boats in the foreground" />
        <SectionHeader eyebrow="Priority sectors" title={<span id="sectors">Where Ghana is asking for capital.</span>} />
        <div className="invest-sector-grid">
          {SECTORS.map((s) => (
            <button key={s.value} type="button" className="invest-sector" onClick={() => start({ sector: s.value })}>
              <Icon name={s.icon} size={24} />
              <span className="invest-sector-name">{s.label}</span>
              <span className="invest-card-text">{s.body}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
