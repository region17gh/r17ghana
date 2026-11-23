import { Button } from "@/components/ui/Button";
import { calendarDate } from "@/lib/event-calendar";
import type { Round } from "@/lib/rounds";
import bostonFlyer from "@/assets/boston-ghana-investment-roundtable-flyer.jpg.asset.json";

export function CalendarEvent({ event }: { event: Round }) {
  const date = calendarDate(event);
  return <article className="calendar-event" aria-labelledby={`event-${event.slug}`}>
    <time className="calendar-date" dateTime={new Date(event.start).toISOString()} aria-label={date.fullDate}>
      <span>{date.month}</span><strong>{date.day}</strong>
    </time>
    <div className="calendar-event-copy">
      <p className="r17-eyebrow">Business roundtable</p>
      <h3 id={`event-${event.slug}`} className="program-h2">{event.title}</h3>
      <p className="calendar-event-theme">{event.theme}</p>
      <div className="calendar-details">
        <p><strong>{date.fullDate}</strong><br />{date.time}<br /><span className="r17-cite">{date.gmt}</span></p>
        <p>{event.venue.map((line) => <span className="calendar-address" key={line}>{line}</span>)}</p>
      </div>
      <Button href={event.rsvp} variant="gold" size="lg" aria-label={`RSVP for ${event.title} on Luma`}>RSVP on Luma ↗</Button>
    </div>
    {event.slug === "boston-2026" && <img className="calendar-flyer" src={bostonFlyer.url} alt="Boston-Ghana Investment Roundtable event flyer" loading="lazy" />}
  </article>;
}