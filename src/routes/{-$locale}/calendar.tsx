import { Link, createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/region17-logo-white-gold-512.png.asset.json";
import { CalendarEvent } from "@/components/events/CalendarEvent";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useEventCalendar } from "@/hooks/useEventCalendar";
import { localePath, useI18n } from "@/i18n";
import "@/styles/calendar.css";

const DESCRIPTION = "Plan your attendance at Region 17 Ghana's upcoming events with event dates, times, locations and RSVP links.";
export const Route = createFileRoute("/{-$locale}/calendar")({
  head: () => ({ meta: [
    { title: "Event calendar | Region 17 Ghana" },
    { name: "description", content: DESCRIPTION },
    { property: "og:title", content: "Event calendar | Region 17 Ghana" },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: EventCalendarPage,
});

function EventCalendarPage() {
  const { locale } = useI18n();
  const { heading, months } = useEventCalendar();
  return <div className="press-shell">
    <a className="press-skip" href="#calendar-main">Skip to content</a>
    <header className="press-masthead">
      <div className="press-container press-header-inner">
        <Link to={localePath(locale, "/")} className="press-logo" aria-label="Region 17 home"><img src={logo.url} alt="Region 17 Ghana" width={512} height={120} /></Link>
        <nav className="press-nav" aria-label="Event navigation">
          <Link to={localePath(locale, "/events")}>Events</Link>
          <Link to="/{-$locale}/calendar" params={{ locale: undefined }} aria-current="page">Calendar</Link>
        </nav>
      </div>
    </header>
    <main id="calendar-main" className="events-hub">
      <header className="calendar-intro"><p className="r17-eyebrow">Gather with Region 17</p><h1 ref={heading} tabIndex={-1} className="program-h1">Event calendar</h1><p>Upcoming conversations and connections for Ghana's development.</p></header>
      {months.length === 0 ? <p className="calendar-empty">New events will appear here when dates are confirmed.</p> : months.map(({ month, items }) => <section className="calendar-month" key={month} aria-label={month}>
        <h2>{month}</h2>{items.map((event) => <CalendarEvent key={event.slug} event={event} />)}
      </section>)}
      <Link className="event-card-open" to={localePath(locale, "/events")}>Explore all events <span aria-hidden="true">↗</span></Link>
    </main>
    <SiteFooter />
  </div>;
}