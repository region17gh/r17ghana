import { Link } from "@tanstack/react-router";

import { localePath, useI18n } from "@/i18n";

/** Event recordings and downloads, so a signed-in member always has something to use. */
export function Recordings() {
  const { locale } = useI18n();
  return (
    <section style={{ marginTop: "var(--space-10)" }} aria-labelledby="rec-h">
      <h2 id="rec-h" style={{ font: "var(--type-subtitle)" }}>From Chicago, November 12, 2026</h2>
      <ul className="thanks-list" style={{ marginTop: "var(--space-3)" }}>
        <li><Link to={localePath(locale, "/program")} hash="main-video-h">Watch the event videos, with captions</Link></li>
        <li><a href="/downloads/run-of-show.pdf" download="Run-of-show.pdf">Run of show (PDF)</a></li>
        <li><a href="/downloads/speaker-bios.pdf" download="Speaker-bios.pdf">Speaker bios (PDF)</a></li>
      </ul>
    </section>
  );
}

export function SettingsLink() {
  const { locale } = useI18n();
  return (
    <p style={{ marginTop: "var(--space-10)" }}>
      <Link to={localePath(locale, "/home/settings")}>Settings and privacy choices</Link>
    </p>
  );
}
