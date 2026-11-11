import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { RunOfShow } from "@/components/program/RunOfShow";
import { Speakers } from "@/components/program/Speakers";
import { PanBand } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { localePath, useI18n } from "@/i18n";
import { PROGRAM_MC, PROGRAM_PLACE, PROGRAM_TITLE, RUN_OF_SHOW, SPEAKERS } from "@/lib/program";

const TITLE = "Program | U.S. and Ghana Business and Investment Roundtable | Region 17";
const DESC = "Speakers and run of show for the November 12, 2026 roundtable at mHUB, Chicago. In person and online.";

export const Route = createFileRoute("/{-$locale}/program")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Event program: speakers and run of show" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { locale, t } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <>
      <PanBand />
      <main className="program-page">
        <p className="r17-eyebrow program-eyebrow">Event program</p>
        <h1 ref={heading} tabIndex={-1} className="program-h1">{PROGRAM_TITLE}</h1>
        <p className="program-meta">{PROGRAM_PLACE}</p>
        <p className="program-meta">{PROGRAM_MC}</p>
        <nav className="program-links" aria-label="Event links">
          <Link to={localePath(locale, "/live")}>Watch online</Link>
          <Link to={localePath(locale, "/")}>Back to home</Link>
        </nav>
        <Speakers list={SPEAKERS} />
        <RunOfShow list={RUN_OF_SHOW} />
        <p className="r17-cite program-note">{t("legal.notAGovernmentDocument")}</p>
      </main>
    </>
  );
}
