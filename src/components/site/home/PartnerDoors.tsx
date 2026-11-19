import { Link } from "@tanstack/react-router";

import { localePath, useI18n } from "@/i18n";
import { PARTNER_DOORS } from "@/lib/site/content";

export function PartnerDoors() {
  const { locale } = useI18n();
  return (
    <section className="site-section" aria-labelledby="partner-h">
      <p className="r17-eyebrow">Partner with us</p>
      <h2 id="partner-h" className="site-h2">Bring what you have to Ghana's regions</h2>
      <ul className="site-doors">
        {PARTNER_DOORS.map((d) => (
          <li key={d.who}>
            <Link to={localePath(locale, d.to)} className="site-perk-name">{d.who}</Link>
            <p className="site-meta">{d.what}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
