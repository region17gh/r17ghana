import { useEffect, useState } from "react";
import { Switch } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { currentSegment, formatRange, zoneShortName, type Segment } from "@/lib/program";

const STORE_KEY = "r17.program.localTime";

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

/** The saved choice is read after hydration, and a blocked storage never breaks the page. */
function readSaved(): boolean {
  try {
    return window.localStorage.getItem(STORE_KEY) === "on";
  } catch {
    return false;
  }
}

export function RunOfShow({ list }: { list: Segment[] }) {
  const clock = useClock();
  const live = clock ? currentSegment(clock.now, list) : -1;
  const viewerZone = clock?.zone ?? "America/Chicago";
  const away = clock !== null && viewerZone !== "America/Chicago";
  const [localFirst, setLocalFirst] = useState(false);

  useEffect(() => setLocalFirst(readSaved()), []);

  const choose = (on: boolean) => {
    setLocalFirst(on);
    try {
      window.localStorage.setItem(STORE_KEY, on ? "on" : "off");
    } catch {
      // A blocked storage only costs the viewer their choice on the next visit.
    }
  };

  const lead = away ? (localFirst ? viewerZone : "America/Chicago") : "America/Chicago";
  const sub = away ? (localFirst ? "America/Chicago" : viewerZone) : null;
  const label = zoneShortName(viewerZone, list[0]?.start);

  return (
    <section aria-labelledby="ros-h" className="program-section">
      <h2 id="ros-h" className="program-h2">Run of show</h2>
      <div className="program-tools">
        <p className="program-note">
          {lead === "America/Chicago"
            ? "All times Central (Chicago)."
            : `Times in your local time (${label}).`}
          {sub ? ` ${sub === "America/Chicago" ? "Central (Chicago)" : `Your local time (${label})`} is shown underneath.` : ""}
        </p>
        {away ? (
          <Switch
            label={`Show my time (${label})`}
            checked={localFirst}
            onChange={choose}
            style={{ minHeight: "var(--control-lg)" }}
          />
        ) : null}
      </div>
      <ol className="program-ros">
        {list.map((s, i) => (
          <li key={s.start} className="program-row" aria-current={i === live ? "step" : undefined}>
            <div className="program-time">
              <span>{formatRange(s, lead)}</span>
              {sub ? <span className="program-local">{formatRange(s, sub)}</span> : null}
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
