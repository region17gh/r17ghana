import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { LinkRecovery } from "@/components/auth/LinkRecovery";
import { InvestInvite } from "@/components/landing/InvestInvite";
import { PageShell } from "@/components/site/PageShell";
import { Chicago } from "@/components/site/home/Chicago";
import { Hero } from "@/components/site/home/Hero";
import { PartnerDoors } from "@/components/site/home/PartnerDoors";
import { WhatWeDo } from "@/components/site/home/WhatWeDo";
import { useI18n } from "@/i18n";
import { clearLinkError, currentLinkError, type LinkProblem } from "@/lib/auth/linkError";
import { WHY_NOW } from "@/lib/site/content";

export const Route = createFileRoute("/{-$locale}/")({
  head: () => ({
    meta: [
      { title: "Region 17 Ghana | Ghana's 17th Region, mobilized" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Region 17 Ghana | Ghana's 17th Region, mobilized" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://r17gh.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://r17gh.com/" }],
  }),
  component: LocaleHome,
});

const DESC = "A free membership for the global African diaspora, connected to Ghana's 16 regions through programs, events, resources, knowledge transfer and services.";

// Brand home. A dead confirmation link lands here with its reason in the URL
// fragment (never sent to the server), so it is read and answered first.
function LocaleHome() {
  const { t } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);
  const [linkProblem, setLinkProblem] = useState<LinkProblem | null>(null);
  useEffect(() => {
    const failure = currentLinkError();
    if (!failure) return;
    setLinkProblem(failure.problem);
    clearLinkError();
  }, []);

  if (linkProblem) {
    return (
      <PageShell>
        <h1 className="site-hero-title">{t("meta.siteName")}</h1>
        <LinkRecovery problem={linkProblem} />
      </PageShell>
    );
  }
  return (
    <PageShell>
        <Hero headingRef={heading} />
        <section className="site-section" aria-labelledby="why-h">
          <p className="r17-eyebrow">Why now</p>
          <h2 id="why-h" className="site-h2">{WHY_NOW.title}</h2>
          <p className="site-lede">{WHY_NOW.body}</p>
        </section>
        <WhatWeDo />
        <Chicago />
        <PartnerDoors />
        <InvestInvite />
    </PageShell>
  );
}
