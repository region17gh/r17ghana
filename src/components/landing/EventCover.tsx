import flyer from "@/assets/ghana-chicago-business-roundtable-flyer.jpg.asset.json";
import { useT } from "@/i18n";
import { FEATURED_EVENT } from "@/lib/event";
import { Reveal } from "@/components/charter/Reveal";

/** Left column: the approved event flyer and the presenting partners. */
export function EventCover() {
  const t = useT();
  return (
    <>
      <Reveal className="landing-reveal">
        {/* width/height are the source file's intrinsic pixels so the browser
            can reserve the slot before the image arrives. The rendered size
            comes from img.landing-photo in landing.css (width 100%, height auto). */}
        <img
          className="landing-photo"
          src={flyer.url}
          alt={t("landing.flyerAlt")}
          width={1024}
          height={1536}
        />
      </Reveal>
      <Reveal className="landing-reveal landing-partners">
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <p className="r17-eyebrow" style={{ margin: "var(--space-0)" }}>{t("landing.partnersLabel")}</p>
          <ul style={{ display: "grid", gap: "var(--space-2)", listStyle: "none", margin: "var(--space-0)", padding: "var(--space-0)", borderTop: "var(--border-width) solid var(--border-inverse)", paddingTop: "var(--space-3)" }}>
            {FEATURED_EVENT.partners.map((partner) => (
              <li key={partner.name} style={{ font: "var(--type-body)" }}>
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--text-on-inverse)", textDecorationColor: "var(--gold-400)" }}
                  >
                    {partner.name}
                  </a>
                ) : (
                  <span style={{ color: "var(--text-on-inverse)" }}>{partner.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </>
  );
}
