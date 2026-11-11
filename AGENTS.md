# Architecture rules

- The join story uses an opaque fixed masthead and one inverse logo, so scrolling content cannot undermine header readability.
- Buttons come from `@/components/ui/Button`, which composes the design system's Button and adds the rest shadow. The library's Button is vendor code and stays unedited; the shadow rides as a class (`r17-lift`) so `:focus-visible`'s box-shadow focus ring still wins, and its colour derives from `--overlay-modal` because the system's navy-tinted shadows composite invisibly on navy bands.
- Zoom credentials stay server-side: `getZoomJoin` signs a short-lived attendee-only (role 0) Meeting SDK token, and the SDK is lazy-loaded only on the live page, so secrets never reach the browser and the homepage stays light.
- The watch page loads Zoom's own UMD build from `public/zoom`, with a React 18 pair loaded first, because the SDK's npm ES build reads React internals that React 19 no longer exposes and dies on import; `src/lib/zoom-client.ts` is the only place that knows those file names, and a test asserts each one is present.
- Investor enquiries (/invest) are anonymous leads, not members: they live in `investor_interests` with consents as rows in `investor_interest_consents`, and are written only through the two SECURITY DEFINER step functions, so visitors never get direct table access.
- Event Q&A (/program) answers only from `eventMaterials()` built from the published program data, via a public server function calling AI Gateway, so answers can't drift from what's on the page.
