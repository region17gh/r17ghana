import { ClientOnly, Link, createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

import { PanBand } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { localePath, useI18n } from "@/i18n";
import { getZoomJoin, type ZoomJoin } from "@/lib/zoom.functions";

const ZoomRoom = lazy(() => import("@/components/live/ZoomRoom"));

export const Route = createFileRoute("/{-$locale}/live")({
  head: () => ({
    meta: [
      { title: "Watch online | Ghana-Chicago Business Roundtable | Region 17" },
      { name: "description", content: "Join the Ghana-Chicago Business Roundtable online on 12 November 2026, 9:00 AM to 1:00 PM Chicago time." },
      { property: "og:title", content: "Watch the Ghana-Chicago Business Roundtable online" },
      { property: "og:description", content: "Attend the 12 November 2026 roundtable from your browser. No sign-up needed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const { locale, t } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);
  const [join, setJoin] = useState<ZoomJoin | null>(null);
  useEffect(() => {
    heading.current?.focus();
    getZoomJoin().then(setJoin, () => setJoin({ ready: false }));
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PanBand />
      <main style={{ flexGrow: 1, width: "100%", maxWidth: "var(--page-max)", marginInline: "auto", paddingBlock: "var(--space-10)", paddingInline: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        <p className="r17-eyebrow" style={{ margin: "var(--space-0)", color: "var(--gold-700)" }}>{t("virtual.eyebrow")}</p>
        <h1 ref={heading} tabIndex={-1} style={{ margin: "var(--space-0)", font: "var(--type-section)" }}>{t("virtual.pageTitle")}</h1>
        <p style={{ margin: "var(--space-0)", maxWidth: "var(--measure-prose)" }}>{t("virtual.howTo")}</p>
        {join === null ? (
          <p role="status">{t("virtual.loading")}</p>
        ) : join.ready ? (
          <>
            <ClientOnly fallback={<p>{t("virtual.loading")}</p>}>
              <Suspense fallback={<p role="status">{t("virtual.loading")}</p>}>
                <ZoomRoom join={join} />
              </Suspense>
            </ClientOnly>
            <a href={join.appUrl} target="_blank" rel="noopener noreferrer">{t("virtual.appLink")}</a>
          </>
        ) : (
          <p role="status">{t("virtual.notReady")}</p>
        )}
        <Link to={localePath(locale, "/")}>{t("virtual.back")}</Link>
        <p className="r17-cite" style={{ margin: "var(--space-0)", maxWidth: "var(--measure-narrow)" }}>{t("legal.notAGovernmentDocument")}</p>
      </main>
    </div>
  );
}
