import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import logo from "@/assets/region17-logo-navy-gold-512.png.asset.json";
import { PanBand } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { localePath, useI18n } from "@/i18n";
import { PROGRAM_PLACE, PROGRAM_TITLE } from "@/lib/program";

const TITLE = "Thank you for attending | Region 17";
const DESC = "Videos, the run of show and speaker bios from the U.S. and Ghana roundtable at mHUB, Chicago, all in one place.";
const URL = "https://r17gh.com/program/thank-you";

export const Route = createFileRoute("/{-$locale}/program_/thank-you")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Thank you for joining the roundtable" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: ThankYouPage,
});

const track = (name: string) => () => window.__lovableEvents?.track?.(name, {});

function ThankYouPage() {
  const { locale, t } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <>
      <PanBand />
      <main className="program-page">
        <Link className="r17-page-logo" to={localePath(locale, "/")} aria-label="Region 17 home"><img src={logo.url} alt="Region 17" width={512} height={120} /></Link>
        <p className="r17-eyebrow program-eyebrow">Thank you</p>
        <h1 ref={heading} tabIndex={-1} className="program-h1">Thank you for joining us</h1>
        <p className="program-meta">{PROGRAM_TITLE}, {PROGRAM_PLACE}</p>

        <h2 className="program-h2">Watch</h2>
        <ul className="thanks-list">
          <li><Link to={localePath(locale, "/events/chicago-2026")} hash="main-video-h">Event videos, with captions</Link></li>
        </ul>

        <h2 className="program-h2">Download</h2>
        <ul className="thanks-list">
          <li><a href="/downloads/run-of-show.pdf" download="Run-of-show.pdf" onClick={track("project.run_of_show_pdf_downloaded")}>Run of show (PDF)</a></li>
          <li><a href="/downloads/speaker-bios.pdf" download="Speaker-bios.pdf" onClick={track("project.speaker_bios_pdf_downloaded")}>Speaker bios (PDF)</a></li>
        </ul>

        <h2 className="program-h2">Stay connected</h2>
        <ul className="thanks-list">
          <li><Link to={localePath(locale, "/join")}>Join Region 17, free</Link></li>
          <li><Link to={localePath(locale, "/invest")}>Register investor interest</Link></li>
        </ul>

        <p className="r17-cite program-note">{t("legal.notAGovernmentDocument")}</p>
      </main>
    </>
  );
}
