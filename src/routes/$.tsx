import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

/**
 * Catch-all for addresses no page owns. Everything unmatched reaches the
 * router's `defaultNotFoundComponent`, so this route exists only to retire the
 * handful of paths that used to mean something.
 *
 * `/index` is the homepage's pre-D-078 address. It matches no route now, so it
 * has to be redirected from here rather than from the locale layout, whose
 * guard never runs for an unmatched URL.
 */
const RETIRED: Record<string, string> = {
  "/index": "/",
};

export const Route = createFileRoute("/$")({
  beforeLoad: ({ location }) => {
    console.log("DBG SPLAT", location.pathname);
    const target = RETIRED[location.pathname];
    if (target) throw redirect({ href: target });
    throw notFound();
  },
});
