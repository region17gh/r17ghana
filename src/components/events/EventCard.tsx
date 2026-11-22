import { Link } from "@tanstack/react-router";
import { Card, Badge } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { localePath, useI18n } from "@/i18n";
import type { EventEntry } from "@/lib/boston";
import bostonFlyer from "@/assets/boston-ghana-investment-roundtable-flyer.jpg.asset.json";
import chicagoPhoto from "@/assets/events/chicago-photos/aa-group-photo-1600.jpg.asset.json";

export function EventCard({ event }: { event: EventEntry }) {
  const { locale } = useI18n();
  const boston = event.slug === "boston-2026";
  return <Card elevation={1} padding="var(--space-0)">
    <article className="event-card-layout">
      <Link className="event-card-image-link" to={localePath(locale, event.href)} aria-label={`Open ${event.title}`}>
        <img className={boston ? "event-card-flyer" : "event-card-photo"} src={boston ? bostonFlyer.url : chicagoPhoto.url} alt={boston ? "Boston-Ghana Investment Roundtable event flyer" : "Guests at the Chicago roundtable"} loading="lazy" />
      </Link>
      <div className="event-card-copy">
        <div><Badge tone={event.upcoming ? "gold" : "neutral"}>{event.upcoming ? "Upcoming" : "Past event"}</Badge></div>
        <p className="event-card-city">{boston ? "Boston" : "Chicago"}</p>
        <h3><Link to={localePath(locale, event.href)}>{event.title}</Link></h3>
        <p className="event-card-date">{event.when}</p>
        <p className="event-card-place">{event.where}</p>
        <p>{event.upcoming ? "Ghana and Massachusetts: trade, investment and institutional partnerships." : "The conversations, guest perspectives and moments from our Chicago gathering."}</p>
        <Link className="event-card-open" to={localePath(locale, event.href)}>{event.upcoming ? "Explore the roundtable" : "Revisit the roundtable"}<span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  </Card>;
}