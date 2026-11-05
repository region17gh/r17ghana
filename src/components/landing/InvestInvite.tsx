import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/charter/Reveal";
import { Button } from "@/components/ui/Button";
import { localePath, useI18n } from "@/i18n";

/**
 * The investment invitation on the home page.
 *
 * The home page's own action is membership, and its gold button is spent on the
 * event band above, so this path is secondary: same register, different door.
 * The wording is the invest page's own, so a reader who follows the link finds
 * what the home page promised.
 */
export function InvestInvite() {
  const { locale, t } = useI18n();

  return (
    <Reveal className="landing-reveal">
      <section className="landing-invest">
        <span className="r17-eyebrow landing-invest-eyebrow">
          {t("landing.investEyebrow")}
        </span>
        <h2 className="landing-invest-title">{t("landing.investTitle")}</h2>
        <p className="landing-invest-lede">{t("landing.investLede")}</p>
        <Link to={localePath(locale, "/invest")} className="landing-invest-link">
          <Button size="lg" variant="secondary" iconAfter="arrow-right">
            {t("landing.investCta")}
          </Button>
        </Link>
      </section>
    </Reveal>
  );
}
