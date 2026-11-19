# Region 17 brand site and member area: phase 1

## Business model review (Foundation draft, Oct 5)
What the site can use now:
- Vision, mission, "The 17th Region" story, the GHANA pillars, the values, and "what we are and are not" for the About page.
- PERKS (Programs, Events, Resources, Knowledge transfer, Services) as the homepage's "What we do". Note: this is five categories, not the four pages in my first draft. Knowledge transfer gets its own page.
- Membership is just the free Community tier: member number, profile, Ghana and region pages, live sessions, news of events. No prices, no paid tiers, no checkout.
- Partner path: the five steps (apply, get vetted, agree terms, get listed, stay verified). No vetting fee on the site.

Points to settle before any of it goes live:
1. **The fund.** The draft says "we never hold, pool or manage members' money", but Maabena notes a fund is planned. The site will leave both statements out until the legal structure exists. Saying either one now could be wrong later.
2. **Volta or Eastern first.** The draft says Volta and Maabena says Eastern. The site already has a Volta region page. Which region leads Delegations and the 2027 Summit?
3. **Promises the site can't keep yet.** "Every engagement done right", "vetted partners, fixed prices" and "Charter Members get the Member tier free" describe things that don't exist yet. I'll word them as aims ("we are building"), not facts, or leave them out.
4. **Relocation soft landing** (Maabena's question). It fits under Services as "we connect you with licensed partners". Any question on residency, citizenship or the Ghana Card is referred to the Diaspora Affairs Office or the Ministry of the Interior, never advised on.
5. **"No fees on investments"** (Maabena asked for an explanation). It keeps R17GH from acting as an unlicensed broker. Keep it on the site in plain words.
6. **Constituency equality.** The draft puts Ghanaians and heritage "at the centre", with others "around them". Your workspace rule says no ranking of who belongs. The site will list all five groups as equals.
7. **Partners "give" column** (Maabena asked about "published standards" and "complaints process"). These need a one-page partner standards document before the partner path launches. I'll draft it later.
8. **Revenue figures and the 60/40 expert split** stay off the public site.

## Where things stand
- The front page today is the join story with the event banners on top. There is no about page.
- 19 people have joined (18 active, 1 still verifying). A member page already exists after sign-in: member card and number with download, matches, asks and offers, perks and a town hall note.
- The member page looks empty because no programs, events or resources are loaded yet (0 listed), and only 1 ask or offer exists. Sign-in is only linked from the footer.
- The mobilization hub (places, asks and offers, matching, engagement review, perks) is already built underneath. Phase 1 brings it to the surface. It does not rebuild it.

## Phase 1a: true homepage and about page (drafted for your review)
**Homepage `/`**, short and editorial, in the existing no-boxes style:
1. Opening: what Region 17 is in one line, with two actions: Join (free) and Sign in
2. Why now: the 17th region declaration, cited
3. What we do: the five PERKS categories, each with its first offering (Diaspora Delegations, Region 17 Summit 2027, Ground Truth, SME Knowledge Exchange, Business setup). One line each, linking to its own page (placeholder pages for now say "coming soon" and offer a way to register interest. No prices)
4. From Chicago: the main roundtable video and a link to the thank-you page
5. Partner with us: four doors (companies and investors, institutions and NGOs, members offering skills, Ghana agencies). Each opens the existing /invest form or a "tell us" note until the full partner intake ships in a later phase
6. Footer with the disclaimer
The join story moves to `/join`, where it already lives. The Zoom band and event banner only show around a live event.

**About page `/about`**: vision, mission, the 17th Region story, GHANA pillars, values, what we are and are not (without the fund line), the declaration, our standing (nonprofit, initiative of the Embassy, not a government body), the four constituencies as equals, team (Maabena Webb, Rosca Sasu), partners from Chicago.

All copy is drafted from what's already on the site and marked for your review before you publish. Nothing about citizenship, visas or promised outcomes.

## Phase 1b: member area people can actually use (free Community membership)
- **Sign in in the header** on every page, showing "My Region 17" once signed in.
- **Member home refresh**, in this order: member card and number (already there), event recordings and downloads (Chicago videos, run of show, speaker bios), "Your matches" with plain-language reasons (already there, with a friendly empty state that points to "Make an ask or offer"), and perks.
- **Settings page `/home/settings`**: one switch per consent the member has given, plus who can see their profile (hidden by default). Turning a switch off adds a revoke record and never deletes one.
- **Load the Chicago recordings as the first listed event**, so members' perks and recordings aren't empty. This needs your OK on the database step below.

## Later phases (not in this plan)
Paid tiers (Member, Premier, Business) only once you say they're ready. Programs, Events, Resources and Services pages with real listings; the full partner intake for all four groups feeding the matching engine; member directory and public profiles; Diaspora Network of Africa introduction once you have text.

## Needs your confirmation
- **Database step (1b):** add one listing for "U.S. and Ghana Regional Business and Investment Roundtable, Chicago" with the 6 videos marked cleared for use, plus a members' settings view of their existing consent records. No member table changes. The safety checks run afterward.
- Points 1 and 2 of the business model review.
- Front page swap: the join story stops being the first thing visitors see at `/`.

## Technical details
- Rewrite `src/routes/{-$locale}/index.tsx` and keep its dead-link recovery logic. New `about.tsx` plus stub `programs`, `events`, `resources`, `knowledge`, `services`, `partners` routes, each with its own head().
- Components stay under 150 lines and go in `src/components/site/`. Copy goes in the i18n `en` dictionary. Design-system components and tokens only.
- Header session state comes from the existing supabase client and the root auth listener.
- Settings reads consents through an RLS-scoped select. Revoke goes through a SECURITY DEFINER function (grants revoked from public) that appends a row. Run `supabase/tests/pass1_invariants.sql` after.
- Offerings seed goes in a migration with literal INSERTs, plus `media_assets` rows with credit, alt text and `is_cleared`.
- Run the narrow-screen check, bun test and the Playwright signed-in check on /home.
