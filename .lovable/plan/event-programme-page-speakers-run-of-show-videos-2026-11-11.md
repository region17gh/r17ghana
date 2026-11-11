# Event programme page: speakers, run of show, videos

The event is tomorrow (12 November). This plan keeps everything on one page so both in-room and online guests find it in one place, and loads fast on phones.

## What visitors will see

One new page, `/programme`, linked from the homepage event section, the online watch page, and a QR code you can print for the room.

1. **Speakers**
   - Two side by side on desktop, stacked on phones.
   - Photos cropped to the same square size automatically, so the uploads don't need to match.
   - Name, title and organisation, then the bio. Both bios show the same length (about 4 lines) with a "Read full bio" control, so the two profiles stay even.
   - In the open, no-box style we already use.

2. **Run of show**
   - A simple timeline: time, segment, who is speaking.
   - Times shown in Central time, with each viewer's local time underneath for online guests abroad.
   - The current segment is highlighted during the event.
   - A "Download run of show (PDF)" button for printing or offline use.

3. **Videos**
   - Each video shows as a still image with a play button. The video only loads when someone taps play, which saves data on phones.
   - Captions where you have them.
   - A download link for each video, if you want guests to be able to keep them.

4. **Downloads**
   - A small "Take this with you" list: the run of show PDF, the speaker bios PDF and the videos.
   - The same PDFs work for in-room printing.

## What I need from you

- **Speakers:** for each one, a photo, name, title, organisation and bio (exact wording, I won't change it).
- **Run of show:** the schedule, as a document, a spreadsheet or pasted text.
- **Videos:** the files, or links (YouTube, Vimeo or similar). Please tell me if guests may download them.
- **Approval:** that each speaker agrees to having their photo and bio published.

## Accessibility

- Readable before fonts load, large tap targets, visible keyboard focus.
- Photos get descriptions so screen readers can read them.
- Videos need captions to be fully accessible. Without captions I'll flag which videos are missing them.

## Technical details

- Content goes in a fixed content file (like `src/lib/event.ts`). No database tables, because none of this is member data.
- Photos and videos are uploaded to the CDN as assets. Each photo is shown as a fixed square crop, and video uses `preload="none"`. If you send YouTube or Vimeo links instead, the player only loads after a tap.
- The PDFs are made ahead of time from the same content and served as fixed files, so they download reliably on iPhone too.
- The page has its own title and description, and passes the dash-free copy checks.
- Nothing is published until you say "publish".
