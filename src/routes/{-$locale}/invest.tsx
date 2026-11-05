import { createFileRoute } from "@tanstack/react-router";

import { Faq, InvestFooter } from "@/components/invest/FaqFooter";
import { HowItWorks, Sectors } from "@/components/invest/HowAndSectors";
import { InvestForm, MobileBar } from "@/components/invest/InvestForm";
import { InvestProvider } from "@/components/invest/InvestContext";
import { InvestHero } from "@/components/invest/InvestHero";
import { DiasporaGap, LawCards } from "@/components/invest/LawAndGap";
import { Opportunity } from "@/components/invest/Opportunity";
import { StatStrip } from "@/components/invest/StatStrip";
import { PanBand } from "@/design-system/region-17-ghana-design-system-e3e62f";
import "@/styles/invest.css";

const TITLE = "R17GH Invest | Invest in Ghana beyond Accra";
const DESC =
  "R17GH connects the global African diaspora to opportunities, incentives and the right people across Ghana's 16 regions. Tell us what you want to build.";

export const Route = createFileRoute("/{-$locale}/invest")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvestPage,
});

function InvestPage() {
  return (
    <InvestProvider>
      <PanBand />
      <InvestHero />
      <main>
        <StatStrip />
        <Opportunity />
        <LawCards />
        <DiasporaGap />
        <HowItWorks />
        <Sectors />
        <InvestForm />
        <Faq />
      </main>
      <InvestFooter />
      <MobileBar />
    </InvestProvider>
  );
}
