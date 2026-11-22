import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/region17-logo-white-gold-512.png.asset.json";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/site/SiteFooter";
import { localePath, useI18n } from "@/i18n";

export function PressShell({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  return <div className="press-shell">
    <a className="press-skip" href="#press-main">Skip to content</a>
    <header className="press-masthead">
      <div className="press-container press-header-inner">
        <Link to={localePath(locale, "/")} className="press-logo" aria-label="Region 17 home"><img src={logo.url} alt="Region 17 Ghana" width={512} height={120} /></Link>
        <nav aria-label="Main navigation" className="press-nav">
          <Link to={localePath(locale, "/program")}>Program</Link>
          <Link to={localePath(locale, "/events")}>Events</Link>
          <Link to="/{-$locale}/press" params={{ locale: undefined }} aria-current="page">Press</Link>
        </nav>
        <div className="press-header-action"><Button variant="inverse" size="lg" href={localePath(locale, "/join")}>Join Region 17</Button></div>
      </div>
    </header>
    <main id="press-main">{children}</main>
    <SiteFooter />
  </div>;
}