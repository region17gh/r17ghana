import { PRESS } from "@/lib/chicago-recap";

export function Press() {
  return (
    <section className="program-section" aria-labelledby="press-h">
      <h2 id="press-h" className="program-h2">In the press</h2>
      <ul className="recap-press">
        {PRESS.map((p) => (
          <li key={p.url}>
            <a href={p.url} target="_blank" rel="noopener noreferrer">{p.title}</a>
            <p className="program-meta">SankofaOnline. Opens their site.</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
