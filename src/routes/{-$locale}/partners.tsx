import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { PageShell } from "@/components/site/PageShell";
import { PartnerDoors } from "@/components/site/home/PartnerDoors";
import { localePath, useI18n } from "@/i18n";
import { PARTNER_STEPS } from "@/lib/site/content";

const DESC = "How companies, institutions, members and Ghana's regions partner with Region 17, and how partners are vetted.";
export const Route = createFileRoute("/{-$locale}/partners")({
  head: () => ({
    meta: [
      { title: "Partner with us | Region 17 Ghana" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Partner with Region 17 Ghana" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://r17gh.com/partners" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://r17gh.com/partners" }],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const { locale } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <PageShell>
      <p className="r17-eyebrow">Partner with us</p>
      <h1 ref={heading} tabIndex={-1} className="site-hero-title">Partners deliver. We vet and coordinate.</h1>
      <section className="site-section">
        <h2 className="site-h2">How it works</h2>
        <ol className="site-list">{PARTNER_STEPS.map((s) => <li key={s}>{s}</li>)}</ol>
        <p className="site-meta">Paying never buys a listing. Only passing vetting does.</p>
      </section>
      <PartnerDoors />
      <p className="site-meta">The full partner application opens soon. Until then, companies and investors can <Link to={localePath(locale, "/invest")}>register interest here</Link>.</p>
    </PageShell>
  );
}
