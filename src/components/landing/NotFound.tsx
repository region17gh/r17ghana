import { PanBand, SectionHeader } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { Button } from "@/components/ui/Button";

/**
 * The page shown for any address that matches nothing.
 *
 * Registered as the router's `defaultNotFoundComponent`, so every route (the
 * locale tree included) renders this instead of TanStack's bare "Not Found"
 * paragraph, which read as a blank screen on a phone.
 */
export function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--paper-050)",
        color: "var(--ink-900)",
      }}
    >
      <PanBand />
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          paddingBlock: "var(--space-16)",
          paddingInline: "var(--space-6)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--measure-narrow)",
            marginInline: "auto",
            display: "grid",
            gap: "var(--space-6)",
          }}
        >
          <SectionHeader
            eyebrow="Page not found"
            title="That address isn't a page yet"
            lede="The link may be out of date, or the page may not have been built. The homepage carries the current event and the way to join."
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
            <Button variant="gold" size="lg" href="/">
              Go to the homepage
            </Button>
            <Button variant="secondary" size="lg" href="/join">
              Join Region 17
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
