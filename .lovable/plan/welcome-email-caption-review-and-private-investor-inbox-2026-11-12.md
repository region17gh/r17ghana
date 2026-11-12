# Welcome email, caption review, and private investor inbox

## Confirmed choices
- Send test messages to **jaune@diasporanetwork.africa**.
- Guests may optionally leave an email address for investor-question replies.
- Keep event registration on **Luma**. Do not create a second RSVP form.
- Use the active **notify.r17gh.com** sender with Region 17 Ghana branding.
- No payments or paid features.

## 1. Member welcome email
- Create a registered, text-forward welcome template in the existing app-email system.
- Include the member number and credential ID as selectable text, using the member's actual record.
- Include this sentence verbatim:

  Region 17 membership is a standing in a community. It is not a government document and confers no citizenship, residence, visa, or right of entry.

- Connect it to the existing activation trigger, replacing the old Resend sending path without changing membership eligibility or registration.
- Preserve the existing active-member gate, duplicate-send protection, and failure recovery. Keep local-morning delivery where the managed service supports it; do not silently switch that policy or build an email queue.
- Send a clearly labeled test with demonstration details, not a real membership credential. Check the send event and any rejection or bounce. Actual arrival requires your inbox confirmation because the service does not report delivered or opened events.

## 2. Review the six videos and captions
- Review the full video/audio alongside each English caption track, including the three videos behind the toggle.
- Check spoken names, monetary amounts, percentages, wording, and cue alignment against the recordings, not against assumptions about Ghana.
- Correct only evidence-backed errors. Flag unclear speech or song lyrics rather than inventing a translation.
- Validate cue order, overlap, and end times against actual video duration. Verify captions display on phone and desktop players.
- Keep the current watch-only restriction and two-visible, three-collapsed layout.

## 3. Investor-question admin inbox
- Save each validated question before requesting an AI answer, so unavailable AI does not lose the question.
- Add an optional reply-email field and clear notice that questions are shared privately with the Region 17 team. Email permission is separate and unchecked by default.
- Save the AI answer or unavailable outcome alongside the question.
- Add a signed-in, administrator-only inbox: newest first, unread/open/replied views, question and AI answer, optional reply address, and a reply composer.
- Send a reply only for the selected question and only to its stored, permissioned address. Anonymous questions remain readable but cannot receive emailed replies.
- Analytics continue to contain counts and outcomes only, never question text or email addresses.
- Give access only to explicitly authorized app administrators. Do not make the test-email recipient an administrator automatically.

### Proposed storage changes, approval required
- **investor_questions:** ID, creation time, question text, optional reply email, AI answer or unavailable outcome, read time, and open/replied state.
- **investor_question_consents:** append-only permission records linked to a question, including granted/revoked timestamps, policy version, and mechanism.
- **investor_question_replies:** question ID, administrator ID, reply text, creation time, and send outcome. These are correspondence records, not an email queue.
- **user_roles:** reuse an existing separate role table if available; otherwise add one with administrator roles. Never store roles on member profiles.
- Anonymous visitors cannot read, edit, or delete these records. Validated server actions create questions; server-verified administrators access the inbox and reply actions. Every new table has explicit grants and RLS.

Approval of this plan authorizes these additive storage changes. No member tables are deleted or restructured.

## 4. Luma RSVP confirmation
- Create a confirmation template with the published event date, Central/Pacific/GMT times, venue, program link, and online access link.
- Connect sending to an actual Luma registration event using Luma's documented integration and caller verification. Opening the RSVP link must never send a confirmation.
- Use a registration-event ID to prevent duplicate confirmations.
- Luma access is not currently connected. Verify the available integration and obtain access through a connection card when needed.
- Check Luma's existing confirmation settings to avoid accidentally sending guests two equivalent confirmations.
- Send a clearly labeled template test to the chosen address. Verify a real RSVP-triggered send only after Luma access is available.

## Technical approach and checks
- Reuse TanStack server functions, the existing managed email helper, and the attached design-system controls. Keep all sender credentials server-side.
- Keep components small, with inbox and form logic in hooks. Add unique page metadata to the admin content route.
- Tests cover administrator access, optional-email permission, stored-recipient-only replies, duplicate sends, exact credential values, and caption timing.
- Run the existing membership invariant audit if a member-table policy or trigger changes. Test anonymous access denial for private records and the signed-in administrator workflow.
- Test the welcome and RSVP templates in light and dark renderings, and run the narrow-phone checks after layout changes.

## External confirmations needed
- The app account that should receive initial administrator access, if no administrator already exists.
- Luma integration access for real RSVP-triggered email.
- Your confirmation that the test emails arrived.

No publishing is included.