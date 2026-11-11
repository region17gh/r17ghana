import { useEffect, useState } from "react";
import { currentSegment, formatRange, type Segment } from "@/lib/program";

/** Viewer's zone and the clock are read after hydration so server and client markup match. */
function useClock() {
  const [state, setState] = useState<{ now: number; zone: string } | null>(null);
  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tick = () => setState({ now: Date.now(), zone });
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return state;
}

export function RunOfShow({ list }: { list: Segment[] }) {
  const clock = useClock();
  const live = clock ? currentSegment(clock.now, list) : -1;
  const showLocal = clock !== null && clock.zone !== "America/Chicago";
  return (
    <section aria-labelledby="ros-h" className="program-section">
      <h2 id="ros-h" className="program-h2">Run of show</h2>
      <p className="program-note">All times Central (Chicago).{showLocal ? " Your local time is shown underneath." : ""}</p>
      <ol className="program-ros">
        {list.map((s, i) => (
          <li key={s.start} className="program-row" aria-current={i === live ? "step" : undefined}>
            <div className="program-time">
              <span>{formatRange(s, "America/Chicago")}</span>
              {showLocal ? <span className="program-local">{formatRange(s, clock.zone)}</span> : null}
            </div>
            <div>
              <p className="program-title">{s.title}{i === live ? <span className="program-now"> Now</span> : null}</p>
              <p className="program-lead">{s.lead}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
