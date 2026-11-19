import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import logo from "@/assets/region17-logo-white-gold-512.png.asset.json";
import { localePath, useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  ["/about", "About"],
  ["/programs", "What we do"],
  ["/partners", "Partner"],
  ["/program/thank-you", "Chicago 2026"],
] as const;

/** Solid navy masthead: readable over any content, and it shows sign-in state. */
export function SiteHeader() {
  const { locale } = useI18n();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to={localePath(locale, "/")} aria-label="Region 17 home" className="site-header-logo">
          <img src={logo.url} alt="Region 17" width={512} height={120} />
        </Link>
        <nav aria-label="Main" className="site-header-nav">
          {NAV.map(([to, label]) => <Link key={to} to={localePath(locale, to)}>{label}</Link>)}
          <Link className="site-header-account" to={localePath(locale, signedIn ? "/home" : "/signin")}>
            {signedIn ? "My Region 17" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
