import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { PageShell } from "@/components/site/PageShell";
import { CONSTITUENCIES, MISSION, PILLARS, TEAM, VALUES, VISION, WE_ARE, WE_ARE_NOT, WHY_NOW } from "@/lib/site/content";
import { ORG_LINE } from "@/lib/invest/content";

const DESC = "Who Region 17 Ghana is: our vision, mission, the GHANA pillars, our values, and what we are and are not.";
export const Route = createFileRoute("/{-$locale}/about")({
  head: () => ({
    meta: [
      { title: "About | Region 17 Ghana" },
      { name: "description", content: DESC },
      { property: "og:title", content: "About Region 17 Ghana" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://r17gh.com/about" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://r17gh.com/about" }],
  }),
  component: AboutPage,
});

function Pairs({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return <dl className="site-pairs">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

function AboutPage() {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <PageShell>
      <p className="r17-eyebrow">About</p>
      <h1 ref={heading} tabIndex={-1} className="site-hero-title">{WHY_NOW.title}</h1>
      <p className="site-lede">{WHY_NOW.body}</p>
      <section className="site-section"><h2 className="site-h2">Vision</h2><p className="site-lede">{VISION}</p></section>
      <section className="site-section"><h2 className="site-h2">Mission</h2><p className="site-lede">{MISSION}</p></section>
      <section className="site-section"><h2 className="site-h2">Our pillars spell GHANA</h2><Pairs rows={PILLARS} /></section>
      <section className="site-section"><h2 className="site-h2">What we value</h2><Pairs rows={VALUES} /></section>
      <section className="site-section">
        <h2 className="site-h2">What we are, and what we are not</h2>
        <ul className="site-list">{WE_ARE.map((x) => <li key={x}>{x}</li>)}</ul>
        <ul className="site-list site-list-not">{WE_ARE_NOT.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
      <section className="site-section">
        <h2 className="site-h2">Who belongs</h2>
        <p className="site-meta">Every group below has the same standing.</p>
        <ul className="site-list">{CONSTITUENCIES.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
      <section className="site-section">
        <h2 className="site-h2">Leadership</h2>
        <Pairs rows={TEAM.map((p) => [p.name, p.role] as const)} />
        <p className="site-meta">{ORG_LINE}</p>
      </section>
    </PageShell>
  );
}
