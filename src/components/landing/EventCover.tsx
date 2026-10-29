import flyer from "@/assets/invest-ghana-flyer.jpg.asset.json";
import { useT } from "@/i18n";
import { FEATURED_EVENT } from "@/lib/event";

/** Left column: the approved event flyer and the presenting partners. */
export function EventCover() {
  const t = useT();
  return (
    <>
      <img
        className="landing-photo"
        src={flyer.url}
        alt={t("landing.flyerAlt")}
        width={1206}
        height={1243}
      />
      <div className="landing-partners" style={{ display: "grid", gap: "var(--space-3)" }}>
        <p className="r17-eyebrow" style={{ margin: "var(--space-0)" }}>{t("landing.partnersLabel")}</p>
        <ul style={{ display: "grid", gap: "var(--space-2)", listStyle: "none", margin: "var(--space-0)", padding: "var(--space-0)", borderTop: "var(--border-width) solid var(--border-inverse)", paddingTop: "var(--space-3)" }}>
          {FEATURED_EVENT.partners.map((partner) => (
            <li key={partner.url} style={{ font: "var(--type-body)" }}>
              <a
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--text-on-inverse)", textDecorationColor: "var(--gold-400)" }}
              >
                {partner.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
