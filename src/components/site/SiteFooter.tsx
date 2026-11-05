import { Link } from "@tanstack/react-router";

import { localePath, useI18n } from "@/i18n";
import { ORG_LINE } from "@/lib/invest/content";

/**
 * The footer that closes a public page.
 *
 * It exists so the two standing paths into the register, joining and investing,
 * are reachable from anywhere on a page rather than only from the address bar.
 * The institutional line is the one already approved for the invest page, so it
 * is imported rather than restated here.
 */
export function SiteFooter() {
  const { locale, t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-wordmark">Region 17 Ghana</p>
        <p className="site-footer-tagline">{t("footer.tagline")}</p>
        <nav aria-label="Footer" className="site-footer-links">
          <Link to={localePath(locale, "/join")}>{t("nav.join")}</Link>
          <Link to={localePath(locale, "/invest")}>{t("nav.invest")}</Link>
          <Link to={localePath(locale, "/signin")}>{t("nav.signIn")}</Link>
        </nav>
        <p className="site-footer-fine">{ORG_LINE}</p>
      </div>
    </footer>
  );
}
