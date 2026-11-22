import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import logo from "@/assets/region17-logo-navy-gold-512.png.asset.json";
import { Press } from "@/components/events/Press";
import { PanBand } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { localePath, useI18n } from "@/i18n";

const DESC = "Press coverage of Region 17 events and the Embassy of Ghana's diaspora roundtables, with links to the original articles.";

export const Route = createFileRoute("/{-$locale}/press")({
  head: () => ({
    meta: [
      { title: "Press | Region 17" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Region 17 in the press" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PressPage,
});

function PressPage() {
  const { locale, t } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <>
      <PanBand />
      <main className="program-page">
        <Link className="r17-page-logo" to={localePath(locale, "/")} aria-label="Region 17 home"><img src={logo.url} alt="Region 17" width={512} height={120} /></Link>
        <h1 ref={heading} tabIndex={-1} className="program-h1">Press</h1>
        <p className="program-meta">Chicago roundtable, November 2026. Articles open on the publisher's site.</p>
        <Press />
        <Link to={localePath(locale, "/events")}>All Region 17 events</Link>
        <Link className="program-home-end" to={localePath(locale, "/")}>Back to Region 17 home</Link>
        <p className="r17-cite program-note">{t("legal.notAGovernmentDocument")}</p>
      </main>
    </>
  );
}
