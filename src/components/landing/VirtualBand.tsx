import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/Button";
import { localePath, useI18n } from "@/i18n";
import { FEATURED_EVENT, eventPhase } from "@/lib/event";
import { getZoomJoin } from "@/lib/zoom.functions";
import { SoonDialog } from "./SoonDialog";

/** Top-of-homepage band pointing virtual guests to the live page. */
export function VirtualBand() {
  const { locale, t } = useI18n();
  const [now, setNow] = useState<number | null>(null);
  const navigate = useNavigate();
  const fetchJoin = useServerFn(getZoomJoin);
  const dialog = useRef<HTMLDialogElement>(null);
  async function watch() {
    const join = await fetchJoin().catch(() => ({ ready: false as const }));
    if (join.ready) void navigate({ to: localePath(locale, "/live") });
    else dialog.current?.showModal();
  }
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  if (!FEATURED_EVENT.virtual.enabled) return null;
  const phase = now === null ? "upcoming" : eventPhase(now, FEATURED_EVENT.virtual.opensAt, FEATURED_EVENT.virtual.closesAt);
  const recording = FEATURED_EVENT.virtual.recordingUrl;

  // Phones get a two-line bar: the serif title and the eyebrow tier are desktop
  // affordances, and a sticky band that eats a third of the screen is a
  // bandwidth problem before it is a taste problem. See .virtual-band in
  // src/styles/landing.css for the sizing.
  return (
    <section aria-label={t("virtual.title")} className="virtual-band">
      <div className="virtual-band-inner">
        <div className="virtual-band-head">
          <p className="r17-eyebrow virtual-band-eyebrow">{t("virtual.eyebrow")}</p>
          <h2 className="virtual-band-title">{t("virtual.title")}</h2>
        </div>
        <p role="status" className="virtual-band-note">
          {t(`virtual.${phase}`)}{" "}
          {phase !== "past" ? <a href={FEATURED_EVENT.rsvpUrl} target="_blank" rel="noopener noreferrer" className="virtual-band-rsvp">{t("virtual.rsvp")}</a> : null}
        </p>
        <div className="virtual-band-cta">
          <Link to={localePath(locale, "/program")} className="virtual-band-link">
            <Button variant="inverse" size="lg">{t("virtual.program")}</Button>
          </Link>
        {phase === "past" ? (
          recording ? (
            <a className="virtual-band-link" href={recording} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" size="lg">{t("virtual.recording")}</Button>
            </a>
          ) : null
        ) : (
          <Button variant="gold" size="lg" aria-haspopup="dialog" onClick={() => void watch()}>{t("virtual.cta")}</Button>
        )}
        </div>
      </div>
      <SoonDialog ref={dialog} />
    </section>
  );
}
