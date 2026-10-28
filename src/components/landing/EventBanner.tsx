import { useEffect, useState } from "react";

import { Button, SectionHeader } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useT } from "@/i18n";
import { FEATURED_EVENT, eventPhase, timeUntil } from "@/lib/event";

/** Event promotion. Phase and countdown are computed after load so SSR markup stays stable. */
export function EventBanner() {
  const t = useT();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const phase = now === null ? "upcoming" : eventPhase(now);
  const left = now === null ? null : timeUntil(now);

  return (
    <section
      style={{
        background: "var(--navy-700)",
        color: "var(--text-on-inverse)",
        paddingBlock: "var(--space-16)",
        paddingInline: "var(--space-6)",
      }}
    >
      <div style={{ maxWidth: "var(--page-max)", marginInline: "auto", display: "grid", gap: "var(--space-6)" }}>
        <SectionHeader inverse eyebrow={t("landing.eventEyebrow")} title={t("landing.eventTitle")} lede={t("landing.eventLede")} />
        {phase === "past" ? (
          <p style={{ margin: "var(--space-0)" }}>{t("landing.past")}</p>
        ) : (
          <>
            <div style={{ display: "grid", gap: "var(--space-1)" }}>
              <p style={{ margin: "var(--space-0)", fontFamily: "var(--font-mono)" }}>{t("landing.eventWhen")}</p>
              <p style={{ margin: "var(--space-0)" }}>{t("landing.eventWhere")}</p>
              {phase === "live" ? (
                <p style={{ margin: "var(--space-0)" }}>{t("landing.live")}</p>
              ) : left ? (
                <p aria-live="polite" style={{ margin: "var(--space-0)", fontFamily: "var(--font-mono)" }}>
                  {t("landing.countdown", left)}
                </p>
              ) : null}
            </div>
            <div>
              <Button variant="gold" size="lg" href={FEATURED_EVENT.rsvpUrl} iconAfter="arrow-up-right">
                {t("landing.rsvp")}
              </Button>
            </div>
          </>
        )}
        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          <p className="r17-eyebrow" style={{ margin: "var(--space-0)" }}>{t("landing.partnersLabel")}</p>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", listStyle: "none", margin: "var(--space-0)", padding: "var(--space-0)" }}>
            {FEATURED_EVENT.partners.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
