import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { localePath, useI18n } from "@/i18n";
import type { Perk } from "@/lib/site/content";
import { PageShell } from "./PageShell";

/** A PERKS category before its listings go live: what it is, and how to hear first. */
export function ComingSoon({ perk }: { perk: Perk }) {
  const { locale } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <PageShell>
      <p className="r17-eyebrow">{perk.name}</p>
      <h1 ref={heading} tabIndex={-1} className="site-hero-title">{perk.verb}</h1>
      <h2 className="site-h2">First: {perk.first}</h2>
      <p className="site-lede">{perk.about}</p>
      <p className="site-meta">Opening soon. Members hear first, by the updates they chose.</p>
      <div className="site-actions">
        <Link to={localePath(locale, "/join")} tabIndex={-1}><Button size="lg">Join, free</Button></Link>
      </div>
    </PageShell>
  );
}

export function perkHead(perk: Perk) {
  const url = `https://r17gh.com/${perk.slug}`;
  const title = `${perk.name} | Region 17 Ghana`;
  return {
    meta: [
      { title },
      { name: "description", content: perk.about },
      { property: "og:title", content: title },
      { property: "og:description", content: perk.about },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
