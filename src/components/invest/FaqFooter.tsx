import logo from "@/assets/region17-logo-white-gold.png.asset.json";
import { SectionHeader } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { FAQ, ORG_LINE } from "@/lib/invest/content";

export function Faq() {
  return (
    <section aria-labelledby="faq" className="invest-section">
      <div className="invest-wrap invest-narrow invest-stack">
        <SectionHeader eyebrow="Questions" title={<span id="faq">Before you write to us.</span>} />
        <div className="invest-faq">
          {FAQ.map((f) => (
            <details key={f.q} className="invest-faq-item">
              <summary className="invest-faq-q">{f.q}</summary>
              <p className="invest-card-text">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InvestFooter() {
  return (
    <footer className="invest-footer">
      <div className="invest-wrap invest-stack-sm">
        <img className="invest-logo" src={logo.url} alt="Region 17, Ghana's 17th region" width={1628} height={380} />
        <p className="invest-gold">One Nation. One Global Diaspora. One Shared Vision.</p>
        <nav aria-label="Footer" className="invest-footer-links">
          <a href="#">About</a>
          <a href="/join">Join R17GH</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </nav>
        <p className="invest-fine">
          Information on this page is provided for general guidance and is not legal, tax or investment advice. Figures are drawn from public sources including the Ghana Investment Promotion Authority and are subject to change. {ORG_LINE}
        </p>
      </div>
    </footer>
  );
}
