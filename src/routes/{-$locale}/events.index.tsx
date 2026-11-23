import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import logo from "@/assets/region17-logo-navy-gold-512.png.asset.json";
import { PanBand } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { localePath, useI18n } from "@/i18n";
import { eventEntries } from "@/lib/boston";
import { useEventClock } from "@/hooks/useEventClock";
import { EventCard } from "@/components/events/EventCard";

const DESC = "Region 17 roundtables and gatherings: what is coming up, and videos and materials from past events.";

export const Route = createFileRoute("/{-$locale}/events/")({
  head: () => ({
    meta: [
      { title: "Events | Region 17" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Region 17 events" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventsHub,
});

function EventsHub() {
  const { locale, t } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const events = eventEntries(useEventClock());
  const upcoming = events.filter((e) => e.upcoming);
  const past = events.filter((e) => !e.upcoming);
  return (
    <>
      <PanBand />
      <main className="events-hub">
        <Link className="r17-page-logo" to={localePath(locale, "/")} aria-label="Region 17 home"><img src={logo.url} alt="Region 17" width={512} height={120} /></Link>
        <header className="events-hub-intro"><p className="r17-eyebrow">In conversation. In person.</p><h1 ref={heading} tabIndex={-1} className="program-h1">Events</h1><p>Connecting people, ideas and partnerships for Ghana's development.</p><Link className="event-card-open" to="/{-$locale}/calendar" params={{ locale: undefined }}>Event calendar <span aria-hidden="true">↗</span></Link></header>
        {upcoming.length > 0 && <section aria-labelledby="up-h" className="events-hub-group"><h2 id="up-h" className="r17-eyebrow program-eyebrow">Upcoming</h2>{upcoming.map((e) => <EventCard key={e.slug} event={e} />)}</section>}
        <section aria-labelledby="past-h" className="events-hub-group"><h2 id="past-h" className="r17-eyebrow program-eyebrow">Past gatherings</h2>{past.map((e) => <EventCard key={e.slug} event={e} />)}</section>
        <Link className="program-home-end" to={localePath(locale, "/")}>Back to Region 17 home</Link>
        <p className="r17-cite program-note">{t("legal.notAGovernmentDocument")}</p>
      </main>
    </>
  );
}
