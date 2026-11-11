import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { downloadIcs } from "@/lib/calendar";
import { currentSegment, formatRange, TIME_ZONES, type Segment } from "@/lib/program";

/** The clock is read after hydration so server and client markup match. */
function useClock() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function RunOfShow({ list }: { list: Segment[] }) {
  const now = useClock();
  const live = now !== null ? currentSegment(now, list) : -1;
  const [central, ...rest] = TIME_ZONES;

  return (
    <section aria-labelledby="ros-h" className="program-section">
      <details className="program-fold" onToggle={(e) => { if (e.currentTarget.open) window.__lovableEvents?.track?.("project.run_of_show_opened", {}); }}>
        <summary className="program-fold-summary">
          <h2 id="ros-h" className="program-h2">Run of show</h2>
          <span className="program-fold-count">{list.length} items</span>
        </summary>
      <div className="program-actions">
        <a className="virtual-band-link" href="/downloads/run-of-show.pdf" download="Run-of-show.pdf" onClick={() => window.__lovableEvents?.track?.("project.run_of_show_pdf_downloaded", {})}>
          <Button variant="primary" size="lg" tabIndex={-1}>Download run of show (PDF)</Button>
        </a>
        <Button variant="secondary" size="lg" onClick={() => { downloadIcs(list, "Region17-program.ics"); window.__lovableEvents?.track?.("project.program_calendar_added", { scope: "all" }); }}>Add whole program to calendar</Button>
      </div>
      <p className="program-note">Every item shows Central (Chicago), West Coast and GMT.</p>
      <ol className="program-ros">
        {list.map((s, i) => (
          <li key={s.start} className="program-row" aria-current={i === live ? "step" : undefined}>
            <div className="program-time">
              <span>{formatRange(s, central.zone)} {central.label}</span>
              {rest.map((z) => (
                <span key={z.zone} className="program-local">{formatRange(s, z.zone)} {z.label}</span>
              ))}
            </div>
            <div>
              <p className="program-title">{s.title}{i === live ? <span className="program-now"> Now</span> : null}</p>
              <p className="program-lead">{s.lead}</p>
              <button type="button" className="program-cal" onClick={() => { downloadIcs([s], "Region17-program-item.ics"); window.__lovableEvents?.track?.("project.program_calendar_added", { scope: "item" }); }}>Add to calendar</button>
            </div>
          </li>
        ))}
      </ol>
      </details>
    </section>
  );
}
