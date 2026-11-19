import { Link } from "@tanstack/react-router";

import { MainVideo } from "@/components/program/Videos";
import { localePath, useI18n } from "@/i18n";
import { MAIN_VIDEO } from "@/lib/program-videos";

export function Chicago() {
  const { locale } = useI18n();
  return (
    <section className="site-section" aria-label="From Chicago">
      <p className="r17-eyebrow">From Chicago, November 12, 2026</p>
      <MainVideo video={MAIN_VIDEO} />
      <Link to={localePath(locale, "/program/thank-you")}>Videos, run of show and speaker bios</Link>
    </section>
  );
}
