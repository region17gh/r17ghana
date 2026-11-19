import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { localePath, useI18n } from "@/i18n";
import { INTRO, MOTTO, TAGLINE } from "@/lib/site/content";

export function Hero({ headingRef }: { headingRef: React.Ref<HTMLHeadingElement> }) {
  const { locale } = useI18n();
  return (
    <section className="site-hero">
      <p className="r17-eyebrow">Region 17 Ghana</p>
      <h1 ref={headingRef} tabIndex={-1} className="site-hero-title">{TAGLINE}</h1>
      <p className="site-lede">{INTRO}</p>
      <div className="site-actions">
        <Link to={localePath(locale, "/join")} tabIndex={-1}><Button size="lg">Join, free</Button></Link>
        <Link to={localePath(locale, "/signin")} tabIndex={-1}><Button size="lg" variant="secondary">Sign in</Button></Link>
      </div>
      <p className="site-motto">{MOTTO}</p>
    </section>
  );
}
