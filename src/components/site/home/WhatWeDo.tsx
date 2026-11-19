import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/charter/Reveal";
import { localePath, useI18n } from "@/i18n";
import { PERKS } from "@/lib/site/content";

export function WhatWeDo() {
  const { locale } = useI18n();
  return (
    <section className="site-section" aria-labelledby="what-h">
      <p className="r17-eyebrow">What we do</p>
      <h2 id="what-h" className="site-h2">Five ways in</h2>
      <ol className="site-perks">
        {PERKS.map((p) => (
          <li key={p.slug} className="site-perk">
            <Reveal className="landing-reveal">
              <Link to={localePath(locale, `/${p.slug}`)} className="site-perk-name">{p.name}</Link>
              <p className="site-meta">{p.verb}. First: {p.first}.</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
