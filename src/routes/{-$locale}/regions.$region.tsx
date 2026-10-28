import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * `/regions/{slug}` was the address region pages held before D-078 flattened
 * them to `/{slug}`. Bookmarks and the links we have already sent out still
 * point here, so the old shape redirects to the new one rather than dying at a
 * 404. Unsupported slugs land on the region page's own guard.
 */
export const Route = createFileRoute("/{-$locale}/regions/$region")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/${params.region}` });
  },
});
