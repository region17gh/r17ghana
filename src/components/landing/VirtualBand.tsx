import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { localePath, useI18n } from "@/i18n";
import { FEATURED_EVENT, eventPhase } from "@/lib/event";

/** Top-of-homepage band pointing virtual guests to the live page. */
export function VirtualBand() {
  const { locale, t } = useI18n();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  if (!FEATURED_EVENT.virtual.enabled) return null;
  const phase = now === null ? "upcoming" : eventPhase(now);
  const recording = FEATURED_EVENT.virtual.recordingUrl;

  return (
    <section
      aria-labelledby="virtual-title"
      style={{
        background: "var(--navy-900)",
        color: "var(--text-on-inverse)",
        borderBottomWidth: "var(--border-width)",
        borderBottomStyle: "solid",
        borderBottomColor: "var(--border-inverse)",
        paddingBlock: "var(--space-5)",
        paddingInline: "var(--space-6)",
      }}
    >
      <div style={{ maxWidth: "var(--page-max)", marginInline: "auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          <p className="r17-eyebrow" style={{ margin: "var(--space-0)", color: "var(--gold-400)" }}>{t("virtual.eyebrow")}</p>
          <h2 id="virtual-title" style={{ margin: "var(--space-0)", font: "var(--type-title)" }}>{t("virtual.title")}</h2>
          <p role="status" style={{ margin: "var(--space-0)", font: "var(--type-body)" }}>{t(`virtual.${phase}`)}</p>
        </div>
        {phase === "past" ? (
          recording ? (
            <a href={recording} target="_blank" rel="noopener noreferrer" style={{ borderBottom: "none" }}>
              <Button variant="gold" size="lg">{t("virtual.recording")}</Button>
            </a>
          ) : null
        ) : (
          <Link to={localePath(locale, "/live")} style={{ borderBottom: "none" }}>
            <Button variant="gold" size="lg">{t("virtual.cta")}</Button>
          </Link>
        )}
      </div>
    </section>
  );
}
