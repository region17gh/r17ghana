# New Region 17 homepage and rebrand

## What we know
- Event: Invest Ghana Business Roundtable, Thursday 12 November 2026, 9:00 AM to 1:00 PM CST, mHUB, 1623 W Fulton St, Chicago. Convened by the Embassy of Ghana in the U.S. with Region 17 and the Ghana National Council of Metropolitan Chicago. RSVP on Luma. Contact info@r17gh.com.
- The homepage shows two things: the event promotion and a call to join Region 17.
- New colours and logo go into the shared design system project, so every page picks them up together.

## Step 1: Rebrand (done by you in the design system project)
1. Upload the new logo (PNG for now, SVG later) and the new colour values to the design system project, then publish it.
2. Update this site to the new design system version. Every page (join flow, regions, consent screen) changes colour automatically, with nothing redone page by page.
3. Swap the nav wordmark and the browser tab icon for the new logo.

## Step 2: New homepage at r17gh.com
Today the homepage sends visitors straight to the join page. It will become a real page:
- **Event banner first**: event name, date, time, venue and a gold "RSVP on Luma" button that opens the Luma page. A countdown to 12 November that disappears once the event starts. After the event, the banner switches to a short "thank you" notice.
- **Partner strip**: the Embassy of Ghana in the U.S., Ghana National Council, mHUB, Rosca and Maabena, each in text with a logo once you send the files. The Embassy logo goes in only as supplied by the Embassy, never the Coat of Arms.
- **Join Region 17**: a short statement, the "Join" button to the existing join flow, and the required disclaimer that membership is not a government document.
- Light pages for mobile data: no video, compressed images.

## What I still need from you
- The new logo files and the exact colour codes, entered in the design system project.
- Partner logos plus written permission to use each one.
- The event cover image from Luma, if you want it shown (or I will use the Luma image).
- Confirm the homepage should open in English at r17gh.com, with the join page still at /join.

## Technical notes
- Homepage replaces the redirect in the locale index route; event details live in the English text file so they can change without code edits.
- Countdown runs only after the page loads, so it never blocks the first view.
- Event date logic gets a small test (before, during, after 12 November).
