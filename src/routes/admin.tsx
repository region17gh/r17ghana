import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/components/auth/AdminLogin";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Team sign in | Region 17 Ghana" },
    { name: "description", content: "Sign in to approve roundtable questions and publish Region 17 press coverage." },
    { property: "og:title", content: "Team sign in | Region 17 Ghana" },
    { property: "og:description", content: "Private team access to question review and press publishing." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AdminLogin,
});