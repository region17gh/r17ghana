# Chicago recap: press, photos and the Maabena clip

All of this goes on the existing Chicago event page (/events/chicago-2026), reached from the Events page. Nothing changes on the Boston /program page.

## Page order
1. Short recap intro (date, venue mHUB, one line on what happened).
2. **Photo gallery** from the Drive folder: a curated set (about 12 to 18 best shots) in a tidy grid of matching sizes, tap to open full size, swipe between photos. Remaining photos behind a "Show all photos" toggle, like the videos.
3. **Videos**: the six event videos already built, plus the new 64-second Maabena clip (phone-friendly copy, cover image, drafted captions).
4. **In the press**: four SankofaOnline articles as clean text links (headline, outlet, date, "Read on SankofaOnline"). We link out, we do not copy the article text, so there is no copyright issue.
5. Downloads (run of show and speaker bios PDFs) and the Join / Invest links, as now.

## How it stays fast on phones
- Photos are resized to small web copies with a larger copy only when opened, and load as you scroll.
- Every photo gets a short description for screen readers.
- Same boxless editorial look and subtle shadows as the rest of the site.

## Things to confirm while I build
- Photo consent: are guests in the photos fine with being shown publicly? Close-ups of individuals can be left out.
- Photo credit line (photographer name), if wanted.
- Who is in the Maabena clip and what title to use (e.g. "Maabena on Rosca savings groups").
- Article headlines are shown as published; figures in them (like the $7.8 billion) are the publisher's, not restated as our own.

## Technical notes
- Photos pulled via the Google Drive connector, resized, uploaded as Lovable Assets; list kept in a data file next to the Chicago event data.
- Clip transcoded to H.264 720p, uploaded as an asset, captions drafted with AI Gateway into WebVTT.
- Press list is a small typed array; article dates and headlines fetched once to fill it.
- Run the narrow-screen check and tests afterwards.
