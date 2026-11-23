import { Link } from "@tanstack/react-router";
import { useEventPress } from "@/hooks/useEventPress";
import { PressVideo } from "@/components/press/PressVideo";

export function SummitCoverage() {
  const coverage = useEventPress();
  const summit = coverage.data?.find((article) => article.slug === "diaspora-summit-joynews");
  if (!summit?.videoId) return null;
  return <section className="program-section" aria-labelledby="summit-coverage-h">
    <h2 id="summit-coverage-h" className="program-h2">The diaspora conversation</h2>
    <p>JoyNews coverage of the 2025 Diaspora Summit. This is background to the Boston roundtable, not its live stream.</p>
    <PressVideo videoId={summit.videoId} title={summit.title} />
    <Link className="event-card-open" to="/{-$locale}/press/$slug" params={{ locale: undefined, slug: summit.slug }}>Read summit coverage <span aria-hidden="true">↗</span></Link>
  </section>;
}