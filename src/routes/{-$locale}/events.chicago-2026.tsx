import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old address for the Chicago recap; kept so shared links and QR codes still work. */
export const Route = createFileRoute("/{-$locale}/events/chicago-2026")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/{-$locale}/events/roundtables/chicago", params, statusCode: 301 });
  },
});
