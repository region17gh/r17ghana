# Architecture rules

- The event calendar derives upcoming entries from `ROUNDS`, using each event's IANA time zone and end time, so dates stay consistent and finished events leave the agenda automatically.

- Press archive and article routes consume `src/lib/press.ts`; add coverage as a catalog entry with stable slug, source attribution and original summary so future additions need no layout changes. Chicago press links use the same catalog.
- Current and archived roundtables compose `RoundProgram`; the Events Hub derives Boston's status and destination from its end time, so archiving does not depend on a manual switch or a redeployment.
- Press video embeds load only after an explicit play action using YouTube's privacy-enhanced host, to keep the archive light before playback.
- Admin access reuses existing member authentication through /admin magic links; one root auth subscriber refreshes identity-dependent queries, and operator permission remains server-checked so signing in never grants publishing access.
- Boston guest submissions use server-validated capture with separate append-only publication consents; only existing platform operators moderate, and realtime subscribes only to the trigger-maintained approved-and-consented public projection, never private questions.
- Press publication state gates the archive, detail routes and related links through a public server read; operator selection publishes questions and coverage in one transaction while new publication records default to draft.

- The join story uses an opaque fixed masthead and one inverse logo, so scrolling content cannot undermine header readability.
- Buttons come from `@/components/ui/Button`, which composes the design system's Button and adds the rest shadow. The library's Button is vendor code and stays unedited; the shadow rides as a class (`r17-lift`) so `:focus-visible`'s box-shadow focus ring still wins, and its colour derives from `--overlay-modal` because the system's navy-tinted shadows composite invisibly on navy bands.
- Zoom credentials stay server-side: `getZoomJoin` signs a short-lived attendee-only (role 0) Meeting SDK token, and the SDK is lazy-loaded only on the live page, so secrets never reach the browser and the homepage stays light.
- The watch page loads Zoom's own UMD build from `public/zoom`, with a React 18 pair loaded first, because the SDK's npm ES build reads React internals that React 19 no longer exposes and dies on import; `src/lib/zoom-client.ts` is the only place that knows those file names, and a test asserts each one is present.
- Investor enquiries (/invest) are anonymous leads, not members: they live in `investor_interests` with consents as rows in `investor_interest_consents`, and are written only through the two SECURITY DEFINER step functions, so visitors never get direct table access.
- Event Q&A (/program) answers only from `eventMaterials()` built from the published program data, via a public server function calling AI Gateway, so answers can't drift from what's on the page.
- Narrow-phone layout is guarded by `scripts/check-narrow-screens.py` (320 to 390px, all main pages); run it after layout changes because sideways overflow is otherwise hidden by the global overflow clip.
- Investor Q&A saves validated questions before inference; inbox and reply actions verify the existing platform-operator role server-side, and replies use only the stored, permissioned address to prevent arbitrary sends.
- Registered app-email templates use managed sending; inline email-only styles copy library tokens because mailbox clients cannot resolve CSS variables. Automatic welcome transport remains unchanged until the owner settles delivery timing/provider.
