# Virtual attendance with Zoom, inside r17gh.com

## What you will see
- A navy "Attend online" band at the very top of the homepage, just under the header. It shows the event date and time in the visitor's own time zone, plus one gold "Watch online" button.
- Before the event, the band reads "Online seats open on 12 Nov" and the button is greyed out. While the event is running it says "Live now". Afterwards it changes to a thank-you note, or links to a recording if you send one.
- A new page at `/en/live` where the Zoom session plays inside our site. It has the event title, a short "How to join" note, and a fallback "Open in the Zoom app" link for people on weak connections or older phones.
- No sign-up. Visitors choose a display name inside the Zoom window, and we store nothing about them.

## What you need to do in Zoom (about 30 minutes)
1. Have a paid Zoom account (Pro or above). Hosting a Webinar also needs the Webinar add-on.
2. Schedule the session for 12 Nov 2026, 9:00 AM to 1:00 PM Chicago time. Turn off "Require registration" and send me the meeting number and passcode.
3. At marketplace.zoom.us, create a "General App", turn on "Meeting SDK", and send me the Client ID and Client Secret. I will store the secret securely. It never shows up in the site.
4. Turn on "Allow participants to join from browser" in your Zoom web settings.
5. To make it work for everyone (not only your own account), Zoom has to review the app. Submit it about 2 to 3 weeks before 12 Nov. Until it's approved, only accounts in your organisation can join through the site, which is enough for testing.

## Trade-offs to know about
- The in-site Zoom player is heavy, roughly 10 to 20 MB on the first visit. To keep the homepage light, it loads only on the live page, and that page always offers the lighter Zoom app link.
- The Zoom passcode lives inside the site, so anyone who reaches the live page can join. That matches your "open link" choice.

## Technical details
- `src/lib/event.ts`: add a `virtual` block (meeting number, enabled flag, optional recording URL) and reuse the current live/past phase logic.
- `src/components/landing/VirtualBand.tsx`: new section at the top of the homepage. Built from design-system Button/Badge with tokens only, and it respects reduced motion.
- `src/routes/{-$locale}/live.tsx`: new route with its own head() metadata. The Zoom Meeting SDK (`@zoom/meetingsdk`, component view) is imported dynamically behind ClientOnly, so it's never in the SSR bundle or on the homepage.
- `src/lib/zoom.functions.ts`: a public server function that signs a short-lived attendee JWT (role 0) with the stored `ZOOM_SDK_SECRET`, using Web Crypto HMAC so it works on Workers. It's rate-limited, and the secret never reaches the browser.
- Secrets: `ZOOM_SDK_KEY`, `ZOOM_SDK_SECRET`, `ZOOM_MEETING_NUMBER`, `ZOOM_MEETING_PASSCODE`.
- Copy goes in `en.json`, with no em dashes and no government wording.
- Tests: band phase at fixed times (before, live, after), and the signature carries attendee role 0 with an expiry of 2 hours or less.
- No database changes. Nothing gets published until you say so.
