import { createFileRoute, Link } from "@tanstack/react-router";
import { InvestorInbox } from "@/components/features/InvestorInbox";

export const Route = createFileRoute("/_authenticated/investor-inbox")({
  head: () => ({ meta: [
    { title: "Investor question inbox | Region 17 Ghana" },
    { name: "description", content: "Private Region 17 Ghana team inbox for investor questions and replies." },
    { property: "og:title", content: "Investor question inbox | Region 17 Ghana" },
    { property: "og:description", content: "Private team correspondence for investor enquiries." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: InboxPage,
});
function InboxPage() {
  return <main className="invest-wrap invest-section invest-stack"><Link to="/">Region 17 home</Link>
    <h1 className="program-h1">Investor question inbox</h1><InvestorInbox /></main>;
}