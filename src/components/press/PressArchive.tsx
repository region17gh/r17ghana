import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { usePressArchive } from "@/hooks/usePressArchive";
import { PRESS_CATEGORIES, pressDate, type PressArticle } from "@/lib/press";
import { PressShell } from "./PressShell";

export function PressArchive({ catalog }: { catalog: PressArticle[] }) {
  const state = usePressArchive(catalog);
  const featured = catalog.find((article) => article.slug === "chicago-business-roundtable");
  return <PressShell>
    <section className="press-container press-intro">
      <p className="press-eyebrow">Region 17 Ghana · Newsroom</p>
      <h1 ref={state.heading} tabIndex={-1}>Press archive</h1>
      <p className="press-lede">The coverage. The conversations. The record.</p>
      <p className="press-intro-note">News and perspectives on connecting the African diaspora with Ghana's development.</p>
    </section>
    {featured?.image && <section className="press-container" aria-labelledby="press-feature-title">
      <Link className="press-feature" to="/{-$locale}/press/$slug" params={{ locale: undefined, slug: featured.slug }}>
        <img src={featured.image.url} alt={featured.image.alt} fetchPriority="high" />
        <div className="press-feature-copy">
          <p className="press-feature-label">Featured coverage · {featured.publisher}</p>
          <h2 id="press-feature-title">{featured.headline}</h2>
          <span className="press-feature-link">Read the story <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
      <p className="press-caption">{featured.image.caption}</p>
    </section>}
    <section className="press-container press-archive" aria-labelledby="press-archive-title">
      <div className="press-section-heading"><h2 id="press-archive-title">All coverage</h2><p className="press-meta" aria-live="polite">{state.articles.length} {state.articles.length === 1 ? "article" : "articles"}</p></div>
      <div className="press-filters">
        <Field label="Search the archive"><Input aria-label="Search the archive" type="search" placeholder="Search stories or publishers" value={state.query} onChange={(event) => state.setQuery(event.target.value)} /></Field>
        <Field label="Type"><Select aria-label="Type" value={state.category} onChange={(event) => state.setCategory(event.target.value)} options={[{ value: "", label: "All coverage" }, ...PRESS_CATEGORIES.map((value) => ({ value, label: value }))]} /></Field>
        <Field label="Year"><Select aria-label="Year" value={state.year} onChange={(event) => state.setYear(event.target.value)} options={[{ value: "", label: "All years" }, ...state.years.map((value) => ({ value, label: value }))]} /></Field>
      </div>
      {state.articles.length > 0 ? <ul className="press-story-list">
        {state.articles.map((article) => <li key={article.slug}>
          <article className="press-story">
            <div className="press-story-date"><time dateTime={article.date}>{pressDate(article.date)}</time><span>{article.category}</span></div>
            <div className="press-story-content"><p className="press-publisher">{article.publisher}</p>
              <h3><Link to="/{-$locale}/press/$slug" params={{ locale: undefined, slug: article.slug }}>{article.headline}<span aria-hidden="true"> ↗</span></Link></h3>
              <p>{article.summary}</p>
            </div>
          </article>
        </li>)}
      </ul> : <div className="press-empty"><h3>No matching articles</h3><p>Try another word or clear the filters.</p><Button variant="secondary" size="lg" onClick={state.clear}>Clear filters</Button></div>}
    </section>
    <aside className="press-context"><div className="press-container"><p className="press-eyebrow">Beyond the headlines</p><h2>See the conversations in full.</h2><p>Event recordings, guest perspectives and materials from our roundtables.</p><Link to="/{-$locale}/events" params={{ locale: undefined }}>Explore the event archive <span aria-hidden="true">→</span></Link></div></aside>
  </PressShell>;
}