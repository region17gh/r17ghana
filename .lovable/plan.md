# Region 17 brand site and member area: phase 1

## Where things stand
- The front page today is the join story with the event banners on top. There is no about page.
- 19 people have joined (18 active, 1 still verifying). A member page already exists after sign-in: member card and number with download, matches, asks and offers, perks and a town hall note.
- The member page looks empty because no programs, events or resources are loaded yet (0 listed), and only 1 ask or offer exists. Sign-in is only linked from the footer.
- The mobilization hub (places, asks and offers, matching, engagement review, perks) is already built underneath. Phase 1 brings it to the surface. It does not rebuild it.

## Phase 1a: true homepage and about page (drafted for your review)
**Homepage `/`**, short and editorial, in the existing no-boxes style:
1. Opening: what Region 17 is in one line, with two actions: Join (free) and Sign in
2. Why now: the 17th region declaration, cited
3. What we do: Programs, Events, Resources, Services, Partnerships. One line each, linking to its own page (placeholder pages for now: "coming soon" plus a way to be told)
4. From Chicago: the main roundtable video and a link to the thank-you page
5. Partner with us: four doors (companies and investors, institutions and NGOs, members offering skills, Ghana agencies). Each opens the existing /invest form or a "tell us" note until the full partner intake ships in a later phase
6. Footer with the disclaimer
The join story moves to `/join`, where it already lives. The Zoom band and event banner only show around a live event.

**About page `/about`**: mission, the declaration, our standing (nonprofit, initiative of the Embassy, not a government body), the four constituencies as equals, team (Maabena Webb, Rosca Sasu), partners from Chicago.

All copy is drafted from what's already on the site and marked for your review before you publish. Nothing about citizenship, visas or promised outcomes.

## Phase 1b: member area people can actually use
- **Sign in in the header** on every page, showing "My Region 17" once signed in.
- **Member home refresh**, in this order: member card and number (already there), event recordings and downloads (Chicago videos, run of show, speaker bios), "Your matches" with plain-language reasons (already there, with a friendly empty state that points to "Make an ask or offer"), and perks.
- **Settings page `/home/settings`**: one switch per consent the member has given, plus who can see their profile (hidden by default). Turning a switch off adds a revoke record and never deletes one.
- **Load the Chicago recordings as the first listed event**, so members' perks and recordings aren't empty. This needs your OK on the database step below.

## Later phases (not in this plan)
Programs, Events, Resources and Services pages with real listings; the full partner intake for all four groups feeding the matching engine; member directory and public profiles; Diaspora Network of Africa introduction once you have text.

## Needs your confirmation
- **Database step (1b):** add one listing for "U.S. and Ghana Regional Business and Investment Roundtable, Chicago" with the 6 videos marked cleared for use, plus a members' settings view of their existing consent records. No member table changes. The safety checks run afterward.
- Front page swap: the join story stops being the first thing visitors see at `/`.

## Technical details
- Rewrite `src/routes/{-$locale}/index.tsx` and keep its dead-link recovery logic. New `about.tsx` plus stub `programs`, `events`, `resources`, `services`, `partners` routes, each with its own head().
- Components stay under 150 lines and go in `src/components/site/`. Copy goes in the i18n `en` dictionary. Design-system components and tokens only.
- Header session state comes from the existing supabase client and the root auth listener.
- Settings reads consents through an RLS-scoped select. Revoke goes through a SECURITY DEFINER function (grants revoked from public) that appends a row. Run `supabase/tests/pass1_invariants.sql` after.
- Offerings seed goes in a migration with literal INSERTs, plus `media_assets` rows with credit, alt text and `is_cleared`.
- Run the narrow-screen check, bun test and the Playwright signed-in check on /home.
