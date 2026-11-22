import { useRef, useState } from "react";
import { FEATURED_PHOTOS, type RecapPhoto } from "@/lib/chicago-recap";

export function PhotoGallery({ list }: { list: RecapPhoto[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const featured = list.filter((p) => FEATURED_PHOTOS.includes(p.id));
  const rest = list.filter((p) => !FEATURED_PHOTOS.includes(p.id));
  const order = [...featured, ...rest];
  const open = (p: RecapPhoto) => { setI(order.indexOf(p)); dialog.current?.showModal(); };
  const step = (d: number) => setI((n) => (n + d + order.length) % order.length);
  const grid = (ps: RecapPhoto[]) => (
    <ul className="recap-photos">
      {ps.map((p) => (
        <li key={p.id}>
          <button type="button" className="recap-thumb" onClick={() => open(p)} aria-label={`Open photo ${order.indexOf(p) + 1} of ${order.length}`}>
            <img src={p.thumb} alt={p.alt} loading="lazy" decoding="async" width={640} height={427} />
          </button>
        </li>
      ))}
    </ul>
  );
  const cur = order[i];
  return (
    <section className="program-section" aria-labelledby="photos-h">
      <h2 id="photos-h" className="program-h2">Photos</h2>
      {grid(featured)}
      {rest.length > 0 && (
        <details className="program-fold">
          <summary><span className="program-h2">Show all photos</span><span className="program-fold-count">{rest.length} more</span></summary>
          {grid(rest)}
        </details>
      )}
      <dialog ref={dialog} className="recap-dialog" aria-label="Photo viewer" onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}>
        {cur && <img src={cur.full} alt={cur.alt} className="recap-full" />}
        <div className="recap-controls">
          <button type="button" onClick={() => step(-1)}>Previous</button>
          <span className="program-meta">{i + 1} / {order.length}</span>
          <button type="button" onClick={() => step(1)}>Next</button>
          <button type="button" onClick={() => dialog.current?.close()}>Close</button>
        </div>
      </dialog>
    </section>
  );
}
