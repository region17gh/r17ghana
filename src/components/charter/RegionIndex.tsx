import { useI18n } from "@/i18n";
import { CHARTER_REGIONS, type CharterRegion } from "@/lib/charter/regions";

/**
 * The other door: the sixteen regions, each with a fact and its own page.
 *
 * The fact is always in the DOM. Above 760px it is a card that rises above the
 * whole grid on hover or focus; below 760px it is simply part of the row. The
 * prototype made it hover-only, which meant a phone, the primary device for
 * this page, could not reach any of it at all.
 *
 * Everything is inside the anchor so the whole card clicks through, which is
 * why the card's title and its arrow are hidden from assistive technology:
 * they repeat the row's own name and the link's own destination, and would
 * otherwise be read back as part of the link.
 *
 * Region pages open in a new tab. This page is a story, and leaving it
 * mid-scroll to read about Volta is not a trip anyone makes back.
 */
export function RegionIndex() {
  const { t } = useI18n();

  return (
    <ul
      className="charter-region-grid charter-fade"
      style={{ "--charter-i": 3 } as React.CSSProperties}
    >
      {CHARTER_REGIONS.map((region) => (
        <li key={region.slug} style={{ "--charter-region-ink": region.ink } as React.CSSProperties}>
          {region.live ? (
            <a href={region.href} target="_blank" rel="noreferrer">
              <RegionBody region={region} note={t("charter.index.go", { url: `r17gh.com/${region.slug}` })} goClass="charter-go" />
            </a>
          ) : (
            <div className="charter-region-row" tabIndex={0}>
              <RegionBody region={region} note={t("charter.index.soon")} goClass="charter-soon" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function RegionBody({ region, note, goClass }: { region: CharterRegion; note: string; goClass: string }) {
  const { t } = useI18n();
  return (
    <>
      <span className="charter-region-name">{region.name}</span>
      <span className="charter-pop">
        <span className="charter-pop-title" aria-hidden="true">
          {region.name} <i>{region.code}</i>
        </span>
        <span className="charter-pop-fact">{t(region.factKey)}</span>
        <span className={goClass}>{note}</span>
      </span>
    </>
  );
}
