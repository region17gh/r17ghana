import { useT } from "@/i18n";
import { CHARTER_IMAGES, fallbackSrc, srcSet } from "@/lib/charter/assets";
import { FEATURED_EVENT } from "@/lib/event";

/** Left column: cover photo and the presenting partners. */
export function EventCover() {
  const t = useT();
  const img = CHARTER_IMAGES.gate;
  return (
    <div className="landing-cover">
      <img
        className="landing-photo"
        src={fallbackSrc(img)}
        srcSet={srcSet(img)}
        sizes="(min-width: 860px) 40vw, 100vw"
        alt={t(img.altKey)}
        width={1024}
        height={1024}
        style={{ objectPosition: img.focus }}
      />
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <p className="r17-eyebrow" style={{ margin: "var(--space-0)" }}>{t("landing.partnersLabel")}</p>
        <ul style={{ display: "grid", gap: "var(--space-2)", listStyle: "none", margin: "var(--space-0)", padding: "var(--space-0)", borderTop: "var(--border-width) solid var(--border-inverse)", paddingTop: "var(--space-3)" }}>
          {FEATURED_EVENT.partners.map((name) => (
            <li key={name} style={{ font: "var(--type-body)" }}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
