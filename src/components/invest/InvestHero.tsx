import hero from "@/assets/invest/hero-eastern-hills.webp";
import heroSm from "@/assets/invest/hero-eastern-hills-800.webp";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/region17-logo-white-gold.png.asset.json";
import { useStart } from "./InvestContext";

export function InvestHero() {
  const start = useStart();
  return (
    <header className="invest-hero">
      <img
        className="invest-hero-img"
        src={hero}
        srcSet={`${heroSm} 800w, ${hero} 1600w`}
        sizes="100vw"
        width={1600}
        height={912}
        alt="Forested hills and a red earth road in Ghana's Eastern Region at sunrise"
        fetchPriority="high"
      />
      <div className="invest-hero-scrim" aria-hidden="true" />
      <div className="invest-hero-body invest-wrap">
        <img className="invest-logo" src={logo.url} alt="Region 17, Ghana's 17th region" width={1628} height={380} />
        <h1 className="invest-hero-title">Invest in Ghana beyond Accra.</h1>
        <p className="invest-hero-sub">
          Opportunities, incentives and the right people across Ghana's 16 regions.
        </p>
        <div className="invest-actions">
          <Button variant="gold" size="lg" onClick={() => start()}>Tell us what you want to build</Button>
          <Button variant="inverse" size="lg" onClick={() => start({ brief: true })}>Get the investor brief</Button>
        </div>
      </div>
    </header>
  );
}
