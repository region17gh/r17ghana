import { Link } from "@tanstack/react-router";
import { localePath, useI18n } from "@/i18n";
import chicagoPhoto from "@/assets/events/chicago-photos/aa-group-photo-640.jpg.asset.json";

export function EventsInvitation() {
  const { locale } = useI18n();
  return <aside className="events-invitation">
    <img src={chicagoPhoto.url} alt="Guests gathered at the Chicago roundtable" loading="lazy" />
    <div><p className="r17-eyebrow">Region 17 gatherings</p><h2 className="program-h2">The conversation continues.</h2>
      <p>Upcoming roundtables. Past conversations, videos and guest perspectives.</p>
      <Link className="event-card-open" to={localePath(locale, "/events")}>Explore all events <span aria-hidden="true">↗</span></Link>
    </div>
  </aside>;
}