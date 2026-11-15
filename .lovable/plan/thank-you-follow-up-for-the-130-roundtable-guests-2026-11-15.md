# Thank-you follow-up for the 130 roundtable guests

## One change to how it is sent
Your guest list has 130 people. The site's email service only allows one-to-one messages a person triggered themselves (a confirmation, a reply). Sending the same email to a whole list through it would break its rules and hurt delivery for every other site email, including welcome emails.

So the thank-you goes out through **Luma's "message guests"** (free, and guests already expect it from there), or your own mailbox. I will write it ready to paste. If you would rather use Resend for a list send, say so and I'll plan that instead.

## What I'll build
1. **Thank-you page at `/program/thank-you`**: one short page with everything a guest needs.
   - Watch the six event videos (with captions)
   - Download the run of show PDF
   - Download the speaker bios PDF (new)
   - Join Region 17 (free) and register investor interest on /invest
   - Nothing about Diaspora Network of Africa yet, per your answer
2. **Speaker bios PDF**: H.E. Victor Emmanuel Smith and Dr. Makeda Smith, with photos, built from the same bios as the page so it never drifts.
3. **Program page after the event**: a small "Thank you for attending" line linking to the new page, shown only once the event has ended.
4. **Thank-you email text** (file in your Files): subject, short body, one main button to the thank-you page, signed "The Region 17 team". Plain wording, no dashes, no promises of outcomes.
5. **QR code** for the thank-you page (PNG and SVG) for slides or social posts.

## What I won't do
- Put the guest list in the site or database. It stays in your spreadsheet.
- Put any guest name or email in links.

## Technical details
- New route `src/routes/program.thank-you.tsx` with its own head metadata; links reuse existing video, PDF and join/invest paths.
- Bios PDF generated from `SPEAKERS` in `src/lib/program.ts`, same pipeline as the run-of-show PDF; test asserts both names appear.
- Post-event notice uses existing `eventPhase()` returning "past".
- Analytics event for bios PDF downloads, matching existing ones.
- Run narrow-screen check and tests.
