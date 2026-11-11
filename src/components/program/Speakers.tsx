import { useState } from "react";
import type { Speaker } from "@/lib/program";

function SpeakerItem({ s }: { s: Speaker }) {
  const [open, setOpen] = useState(false);
  const bioId = `bio-${s.id}`;
  return (
    <article className="program-speaker">
      <img className="program-photo" src={s.photo} alt={s.alt} width={800} height={800} loading="lazy" decoding="async" />
      <h3 className="program-speaker-name">{s.name}</h3>
      <p className="program-speaker-role">{s.role}</p>
      <div id={bioId} className="program-bio" data-open={open}>
        {s.bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
      </div>
      <button type="button" className="program-more" aria-expanded={open} aria-controls={bioId} onClick={() => setOpen((v) => !v)}>
        {open ? "Show less" : "Read full bio"}
      </button>
    </article>
  );
}

export function Speakers({ list }: { list: Speaker[] }) {
  return (
    <section aria-labelledby="speakers-h" className="program-section">
      <h2 id="speakers-h" className="program-h2">Speakers</h2>
      <div className="program-speakers">{list.map((s) => <SpeakerItem key={s.id} s={s} />)}</div>
    </section>
  );
}
