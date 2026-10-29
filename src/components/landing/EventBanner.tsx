import { useEffect, useState } from "react";

import { Icon } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/region17-logo-white-gold.png.asset.json";
import seal from "@/design-system/region-17-ghana-design-system-e3e62f/assets/logos/region17-seal.png";
import { Link } from "@tanstack/react-router";
import { localePath, useI18n } from "@/i18n";
import { FEATURED_EVENT, eventPhase, timeUntil } from "@/lib/event";
import { Reveal } from "@/components/charter/Reveal";
import { EventCover } from "./EventCover";

const m0 = { margin: "var(--space-0)" };

/** Event promotion laid out like an event listing. Phase is computed after load so SSR markup stays stable. */
export function EventBanner() {
  const { locale, t } = useI18n();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const phase = now === null ? "upcoming" : eventPhase(now);
  const left = now === null ? null : timeUntil(now);

  return (
    <section className="landing-section" style={{ background: "var(--navy-700)", color: "var(--text-on-inverse)" }}>
      <div
        className="landing-masthead"
        style={{ maxWidth: "var(--page-max)", marginInline: "auto", marginBottom: "var(--space-10)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}
      >
        <img src={logo.url} alt="Region 17, Ghana's 17th region" width={1628} height={380} style={{ height: "var(--space-10)", width: "auto" }} />
        <img className="landing-seal" src={seal} alt={t("landing.sealAlt")} />
      </div>
      <div className="landing-event">
        <EventCover />
        <div className="landing-details">
          <p className="r17-eyebrow" style={{ ...m0, color: "var(--gold-400)" }}>{t("landing.eventEyebrow")}</p>
          <h1 className="landing-title" style={m0}>{t("landing.eventTitle")}</h1>

          <Reveal className="landing-reveal">
            <div className="landing-row">
              <div className="landing-tile" aria-hidden="true">
                <span className="landing-tile-month">{t("landing.tileMonth")}</span>
                <span style={{ font: "var(--type-title)", fontFamily: "var(--font-mono)" }}>12</span>
              </div>
              <div>
                <p style={{ ...m0, font: "var(--type-title)" }}>{t("landing.eventDay")}</p>
                <p style={{ ...m0, font: "var(--type-meta)", color: "var(--navy-200)" }}>{t("landing.eventTime")}</p>
              </div>
            </div>
          </Reveal>
          <Reveal className="landing-reveal">
            <div className="landing-row">
              <div className="landing-tile landing-pin" aria-hidden="true"><Icon name="map-pin" /></div>
              <div>
                <a
                  href={FEATURED_EVENT.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit", textDecorationColor: "var(--gold-400)" }}
                >
                  <p style={{ ...m0, font: "var(--type-title)" }}>{t("landing.eventVenue")}</p>
                  <p style={{ ...m0, font: "var(--type-meta)", color: "var(--navy-200)" }}>{t("landing.eventAddress")}</p>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal className="landing-reveal">
            <div className="landing-panel">
              <div className="landing-panel-head">{t("landing.registrationHead")}</div>
              <div className="landing-panel-body">
                {phase === "past" ? (
                  <p style={m0}>{t("landing.past")}</p>
                ) : (
                  <>
                    <p style={m0}>{phase === "live" ? t("landing.live") : t("landing.registrationBody")}</p>
                    {phase === "upcoming" && left ? (
                      <p aria-live="polite" style={{ ...m0, fontFamily: "var(--font-mono)", color: "var(--gold-400)" }}>{t("landing.countdown", left)}</p>
                    ) : null}
                    <Button variant="gold" size="lg" href={FEATURED_EVENT.rsvpUrl}>{t("landing.rsvp")}</Button>
                  </>
                )}
                <p style={{ ...m0, font: "var(--type-meta)", color: "var(--navy-200)" }}>{t("landing.joinPrompt")}</p>
                <Link to={localePath(locale, "/join")} style={{ borderBottom: "none" }}>
                  <Button variant="inverse" size="lg">{t("landing.joinLink")}</Button>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal className="landing-reveal">
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              <p className="r17-eyebrow" style={{ ...m0, borderBottom: "var(--border-width) solid var(--border-inverse)", paddingBottom: "var(--space-3)" }}>{t("landing.aboutHead")}</p>
              <p style={{ ...m0, font: "var(--type-body)", maxWidth: "var(--measure-prose)" }}>{t("landing.eventLede")}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
