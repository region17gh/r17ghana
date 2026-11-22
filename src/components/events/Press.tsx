import { useEventPress } from "@/hooks/useEventPress";

export function Press() {
  const coverage = useEventPress();
  return (
    <section className="program-section" aria-labelledby="press-h">
      <h2 id="press-h" className="program-h2">In the press</h2>
      <ul className="recap-press">
        {(coverage.data ?? []).filter((article) => article.publisher === "SankofaOnline").map((p) => (
          <li key={p.url}>
            <a href={p.url} target="_blank" rel="noopener noreferrer">{p.title}</a>
            <p className="program-meta">SankofaOnline. Opens their site.</p>
          </li>
        ))}
      </ul>
      {coverage.isPending && <p role="status">Loading coverage...</p>}
      {coverage.error && <p role="alert">Coverage is unavailable. Please try again.</p>}
    </section>
  );
}
