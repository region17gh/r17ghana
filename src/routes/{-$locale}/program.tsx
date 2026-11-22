import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import logo from "@/assets/region17-logo-navy-gold-512.png.asset.json";
import { Speakers } from "@/components/program/Speakers";
import { Button } from "@/components/ui/Button";
import { PanBand } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { localePath, useI18n } from "@/i18n";
import { ROUNDS, currentRound } from "@/lib/rounds";
import { SPEAKERS } from "@/lib/program";

// Head is rendered on the server; it names the round current at build/request time.
const R0 = currentRound(Date.now());
const TITLE = `Program | ${R0.title} | Region 17`;
const DESC = `${R0.dateLine}: ${R0.theme}. RSVP only.`;

export const Route = createFileRoute("/{-$locale}/program")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: R0.title },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CurrentProgram,
});


function CurrentProgram() {
  const { locale, t } = useI18n();
  const [now, setNow] = useState(R0.start - 1);
  useEffect(() => setNow(Date.now()), []);
  const round = currentRound(now, ROUNDS);
  const past = now >= round.end;
  const speakers = SPEAKERS.filter((s) => round.speakerIds.includes(s.id));
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <>
      <PanBand />
      <main className="program-page">
        <Link className="r17-page-logo" to={localePath(locale, "/")} aria-label="Region 17 home"><img src={logo.url} alt="Region 17" width={512} height={120} /></Link>
        <p className="r17-eyebrow program-eyebrow">{past ? "Past event" : "Upcoming event"}</p>
        <h1 ref={heading} tabIndex={-1} className="program-h1">{round.title}</h1>
        <p className="program-meta">{round.theme}</p>
        <p className="program-meta">{round.dateLine}</p>
        <address className="program-meta">{round.venue.join(", ")}</address>
        <div className="program-links">
          <a href={round.rsvp} target="_blank" rel="noopener noreferrer" onClick={() => window.__lovableEvents?.track?.("project.boston_rsvp_clicked", {})}>
            <Button variant="primary" size="lg" tabIndex={-1}>RSVP to confirm your seat</Button>
          </a>
        </div>
        <p className="program-note">RSVP only. Seats are confirmed through the registration page.</p>

        <section className="program-section" aria-labelledby="about-h">
          <h2 id="about-h" className="program-h2">About the roundtable</h2>
          {round.about.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        </section>

        <section className="program-section" aria-labelledby="partners-h">
          <h2 id="partners-h" className="program-h2">Presented by</h2>
          <ul>{round.partners.map((p) => <li key={p}>{p}</li>)}</ul>
        </section>

        {speakers.length > 0 && <Speakers list={speakers} />}

        <section className="program-section" aria-labelledby="ros-h">
          <h2 id="ros-h" className="program-h2">Run of show</h2>
          <p className="program-note">The full run of show and speaker list will be posted here before the event.</p>
        </section>

        <section className="program-section" aria-labelledby="contact-h">
          <h2 id="contact-h" className="program-h2">Questions</h2>
          <p>Contact Region 17 at <a href={`mailto:${round.contact}`}>{round.contact}</a>.</p>
          <Link to={localePath(locale, "/events")}>See past events, including the Chicago videos</Link>
        </section>

        <Link className="program-home-end" to={localePath(locale, "/")}>Back to Region 17 home</Link>
        <p className="r17-cite program-note">{t("legal.notAGovernmentDocument")}</p>
      </main>
    </>
  );
}
