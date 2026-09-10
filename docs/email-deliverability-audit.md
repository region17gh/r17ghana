# Email deliverability audit: the join code landing in Gmail spam

Read-only audit. Nothing in the sending path was changed. Every proposed change
below is written out as a diff and left unapplied, per the brief.

Observed failure: a real registration produced a message from
"Team Region 17 Ghana", subject "Your Region 17 code is 211940", delivered to
the Gmail spam folder. The Executive Director almost certainly hit the same
thing and never saw her code.

The open-items log records this as sending reputation with DMARC understood to
be correct. **The DMARC record is present and is not the problem. The SPF record
is broken, and that part of the assumption does not survive checking.** Detail in
section 3.

---

## 1. Where the code email comes from

**It is GoTrue. Not the application's Resend path.** Confidence: High.

Step 1 of the register calls Supabase Auth directly from the browser:

- `src/components/join/steps/StepWhoYouAre.tsx:59` — `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, ... } })`
- `src/components/join/steps/StepConfirmEmail.tsx:87` — the same call, for "send me another"
- `src/components/join/steps/StepConfirmEmail.tsx:69` — `supabase.auth.verifyOtp`

`sendEmail` in `src/server/resend.server.ts` is never reached by this flow. Its
own header comment says so, and the code agrees: the only caller in the
repository is the welcome email in `src/server/welcome.ts:119`. Supabase custom
SMTP routes GoTrue's mail through Resend as a separate transport, and that path
does not pass through any application code.

**The subject line is in the repository, but the repository is not what is
deployed.** This needs stating precisely, because the wrong reading of it causes
a wasted edit:

- `supabase/config.toml:22` holds `subject = "Your Region 17 code is {{ .Token }}"`
- `supabase/config.toml:26` holds the magic-link equivalent
- `supabase/templates/confirm-signup.html` and `magic-link.html` hold the bodies

That file is the source of record by convention, not by mechanism. This is a
hosted project; nothing pushes `config.toml` to it. No workflow in
`.github/workflows/` runs `supabase link` or `supabase config push` — the only
Supabase workflow, `pass1-invariants.yml`, resolves a preview branch and runs a
SQL harness. The file says as much itself at lines 18-19: "This project is
hosted, so these files are the source of record and the Dashboard has to be kept
matching them."

So the live subject line is the one in **Supabase Dashboard, Authentication,
Email Templates**. The observed subject matches `config.toml:22` exactly, so the
Dashboard is currently in sync. Changing the subject means changing both: the
Dashboard for effect, the file to keep the record honest. Editing only the file
changes nothing about what members receive.

No application-side OTP path was built, considered, or is proposed.

---

## 2. What the application does control

Audited `src/server/resend.server.ts`, `src/server/welcome.ts`,
`src/lib/email/welcome.ts`, `src/lib/email/schedule.ts`.

### From address

`Region 17 <notifications@r17gh.com>`, sending domain **r17gh.com** (apex).
Confidence: Moderate on the live value, High on the repository's intent.

Resolution order is vault first, environment second
(`src/server/resend.server.ts:46-67`): `get_notifier_config()` returns
`mail_from`, falling back to `RESEND_FROM`. The vault value is seeded at
`supabase/migrations/20260831052549_shared_suppression_and_credentials.sql:27`
and no later migration overwrites it. The live vault value could not be read
from this session — the Supabase MCP connection returned a permission error on
`vault.decrypted_secrets` — so the audited value is the seeded one.

This is the right domain. It is the apex, it matches the domain the Resend DKIM
key is published under, and the visible From domain and the DKIM signing domain
therefore align. No mismatch here.

### RESEND_REPLY_TO

Declared in `.env.example`, no value in the repository, live value unknown.
Read at `src/server/resend.server.ts:118` and set as `reply_to` when non-empty.

**Real finding, unrelated to spam but worth one line:** this is the only piece of
transport config read from `process.env` alone. The API key and the From address
both go through the vault with the environment as fallback, deliberately, so that
"the vault is the single source both this path and the notifier edge function can
reach". Reply-to does not. If it is ever set in the vault rather than the
environment, or if the runtime does not populate `process.env`, it is silently
dropped and no one finds out. Proposed fix in section 5.

### Bare numeric code in a subject line

**The application path: no. The GoTrue path: yes, and this is a genuine spam
signal.** Confidence: High that the pattern is a signal; Moderate on how much of
this specific delivery it explains.

- Application subject, `src/lib/email/welcome.ts:120` reading
  `src/i18n/locales/en.json:381`: `"Welcome to Region 17. You are member {number}."`
  The number is zero-padded to six digits, so a real subject reads "You are
  member 000042." A six-digit numeric string in a subject, but carried by a
  sentence and preceded by the word "member". Low risk.
- GoTrue subject, `supabase/config.toml:22`: `"Your Region 17 code is 211940"`.
  This is the exact shape filters score: short subject, terminal bare numeric
  code, no other content. Combined with a cold domain it is a meaningful part of
  the verdict.

### HTML and plain text on every send

**Application path: both parts, always. GoTrue path: HTML only.**
Confidence: High on both.

`OutboundEmail` (`src/server/resend.server.ts:17-32`) types `html` and `text` as
required non-optional strings, and `sendEmail` writes both into the request body
unconditionally (lines 109-115). `buildWelcomeEmail`
(`src/lib/email/welcome.ts:119-124`) always returns both, with `renderText`
carrying a real plain-text rendering rather than a stripped one. There is no
path by which the application sends an HTML-only message.

GoTrue is the opposite. Its mailer sets a single `text/html` body from the
configured template and generates no `text/plain` alternative. So the code email
is HTML-only — and the HTML it sends is a bare fragment starting at `<h2>`
(`supabase/templates/confirm-signup.html:15`), with no doctype, no `<html>`, no
`<head>`. Short, HTML-only, malformed-as-a-document, one link, one numeric code,
from a domain with no sending history. Each is minor; the stack is not.

### List-Unsubscribe

**Not set on anything.** Confidence: High.

`sendEmail` builds its request body at `src/server/resend.server.ts:109-119` and
never sets a `headers` key. There is no way for any caller to attach one.

Worth knowing: the database already has the whole RFC 8058 apparatus —
`ensure_unsubscribe_token` and `consume_unsubscribe_token` in
`supabase/migrations/20260830160200_claim_email_batch.sql`, with
`resolve_delivery` forcing essential kinds through regardless of preference. It
was built for the notifier queue, and the notifier edge function is not in this
repository (`supabase/functions/` does not exist here). The application path
never picked it up.

The welcome email is transactional and one-shot, so this is not a compliance gap
and it is not what put the code email in spam. It is cheap points with Gmail on
the one non-auth message the application does send.

---

## 3. DNS authentication: the assumption does not hold

Resolved against 1.1.1.1 and 8.8.8.8, cross-checked, answers identical. The
domain is on Cloudflare nameservers (`gerald.ns.cloudflare.com`,
`kallie.ns.cloudflare.com`).

| Record | Name | Result |
|---|---|---|
| SPF (apex) | `r17gh.com` TXT | **Absent.** Only `google-site-verification=...` |
| SPF (send) | `send.r17gh.com` TXT | `v=spf1 include:dc-fd741b8612._spfm.send.r17gh.com ~all` |
| SPF include target | `dc-fd741b8612._spfm.send.r17gh.com` | **NXDOMAIN.** No TXT, no CNAME, no delegation |
| DKIM (Resend) | `resend._domainkey.r17gh.com` TXT | Present, 1024-bit RSA |
| DKIM (Workspace) | `google._domainkey.r17gh.com` TXT | Present, 2048-bit RSA |
| Bounce/Return-Path | `send.r17gh.com` MX | `feedback-smtp.us-east-1.amazonses.com` |
| DMARC | `_dmarc.r17gh.com` TXT | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=...` |
| MX (apex) | `r17gh.com` | `smtp.google.com` — Workspace |

### The finding

**Resend's SPF record permanently errors.** Confidence: High.

`send.r17gh.com` publishes an SPF record whose only mechanism is an `include:`
pointing at `dc-fd741b8612._spfm.send.r17gh.com`. That name does not exist. Both
resolvers return NXDOMAIN, authoritatively, from the domain's own Cloudflare
nameservers — this is not propagation lag or a resolver artifact. RFC 7208 §5.2
is explicit: an `include:` whose target has no SPF record makes the entire
evaluation return **permerror**, not `~all`, not neutral, not softfail.

This is Resend's SPF-managed setup left half-finished. The `_spfm` delegation
that Resend hosts was either never completed on the Cloudflare side or the
identifier was rotated and the record here went stale. Either way it is broken
right now.

So mail leaving Resend gets **SPF: permerror**. Not a pass. A receiver reading
that sees a sender whose SPF configuration is actively broken, which scores
worse than having no SPF at all.

### What still works, and why the mail arrives rather than vanishing

DMARC currently passes on DKIM alone. Confidence: Moderate.

`resend._domainkey.r17gh.com` is published, the From domain is `r17gh.com`, so
`d=r17gh.com` aligns under `adkim=r` and DMARC is satisfied without SPF. That is
why the message is quarantined to spam rather than rejected outright under
`p=quarantine`.

It also means **DKIM is the only thing standing between the current setup and
every message being quarantined.** No second factor. A forwarded message, a
list, a mailing-list footer rewrite, any modification that breaks the signature,
and the message fails DMARC outright with a `p=quarantine` policy waiting for it.
That is a one-fault-from-total-failure posture, and the fault is already
half-materialised.

### Two more, smaller

1. **The apex has no SPF at all**, while `smtp.google.com` is the MX and
   `google._domainkey.r17gh.com` is published. Human mail from
   `@r17gh.com` through Workspace therefore also has SPF none, and is also
   relying on DKIM alone against `p=quarantine`. Confidence: High on the DNS
   facts, Moderate on whether Workspace DKIM signing is actually switched on —
   the key being published does not prove the toggle is enabled, and if it is
   not, all staff mail is quarantining too.
2. **The Resend DKIM key is 1024-bit** where Workspace's is 2048-bit. 1024 is
   Resend's default and is accepted everywhere; 2048 is the current
   recommendation. Minor. Not worth a rotation on its own.

### The one thing this session could not determine

**What From address Supabase custom SMTP actually sends as.** It is a Dashboard
setting, it is not in this repository, and it is not readable from here.

This matters more than everything else in this section, because it is the one
remaining way the picture could be much worse than described. The observed
sender name was "Team Region 17 Ghana", which does not match the application's
`Region 17`. That proves the two paths carry different sender names, which is
itself a mild consistency signal — but it also means the address behind that
name is unverified. **If the Supabase SMTP sender is on any domain other than
`r17gh.com`, DKIM does not align, DMARC fails outright, and `p=quarantine`
guarantees the spam folder for every code email sent.** That would be a complete
explanation of the reported symptom rather than a contributing one.

Founder check, one minute, decisive: open the message in Gmail spam, Show
original, and read the three lines at the top — SPF, DKIM, DMARC — plus the
`From:` and `Return-Path:` headers. That settles it.

---

## 4. Fixable in this repository

Two changes, both real, neither of which is the main cause. Diffs given,
unapplied.

### 4a. Take the code out of the subject line (record half)

`supabase/config.toml` is the record; the Dashboard is the effect. Change both or
neither. The Dashboard half is in section 5.

```diff
--- a/supabase/config.toml
+++ b/supabase/config.toml
@@ -19,11 +19,17 @@
 # This project is hosted, so these files are the source of record and the
 # Dashboard (Authentication, Email Templates) has to be kept matching them.
+#
+# ON THE SUBJECT LINES. Neither carries `{{ .Token }}`. A subject ending in a
+# bare six-digit number is a pattern spam filters score against, and this
+# message went to Gmail spam in the wild while carrying one. The code is in the
+# body, where the member reads it anyway; the subject says what the message is.
+# Do not put the token back in a subject line.
 
 [auth.email.template.confirmation]
-subject = "Your Region 17 code is {{ .Token }}"
+subject = "Confirm your email address for Region 17"
 content_path = "./supabase/templates/confirm-signup.html"
 
 [auth.email.template.magic_link]
-subject = "Your Region 17 sign-in code is {{ .Token }}"
+subject = "Sign in to Region 17"
 content_path = "./supabase/templates/magic-link.html"
```

Cost: the member no longer sees the code in the notification preview and has to
open the message. Worth it against landing in spam, where they see nothing at
all. Confidence that this helps: Moderate. It removes a known signal; it is not
by itself sufficient.

### 4b. Read reply-to through the vault, like every other transport value

Fixes the inconsistency in section 2. Not a deliverability fix in itself, though
a working reply-to on a young domain is a small positive signal, and a silently
dropped one is a support hole.

This touches only `transportConfig`. It does not go near the suppression check or
the idempotency key.

```diff
--- a/src/server/resend.server.ts
+++ b/src/server/resend.server.ts
@@ -43,20 +43,25 @@
  * and the notifier edge function can reach, so it is the single source; the
  * environment stays as a fallback for local work and for the case where the
  * database is unreachable but mail still has to leave.
+ *
+ * Reply-to resolves the same way and for the same reason. It used to read the
+ * environment alone, which meant a value set in the vault was silently ignored
+ * and nobody found out until a member's reply went nowhere.
  */
-async function transportConfig(): Promise<{ apiKey: string | null; from: string | null }> {
+async function transportConfig(): Promise<{
+  apiKey: string | null;
+  from: string | null;
+  replyTo: string | null;
+}> {
   const envKey = process.env["RESEND_API_KEY"]?.trim() || null;
   const envFrom = process.env["RESEND_FROM"]?.trim() || null;
+  const envReplyTo = process.env["RESEND_REPLY_TO"]?.trim() || null;
 
   try {
     const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
     const { data, error } = await supabaseAdmin.rpc("get_notifier_config");
-    if (error || !data) return { apiKey: envKey, from: envFrom };
+    if (error || !data) return { apiKey: envKey, from: envFrom, replyTo: envReplyTo };
 
     const config = data as {
       resend_api_key: string | null;
       mail_from: string | null;
+      mail_reply_to: string | null;
     };
     return {
       apiKey: config.resend_api_key?.trim() || envKey,
       from: config.mail_from?.trim() || envFrom,
+      replyTo: config.mail_reply_to?.trim() || envReplyTo,
     };
   } catch {
     // Never let a config read failure be the reason mail stops.
-    return { apiKey: envKey, from: envFrom };
+    return { apiKey: envKey, from: envFrom, replyTo: envReplyTo };
   }
 }
@@ -96,7 +101,7 @@
   }
 
-  const { apiKey, from } = await transportConfig();
+  const { apiKey, from, replyTo } = await transportConfig();
   if (!apiKey) return { sent: false, reason: "Resend API key is not configured" };
   if (!from) return { sent: false, reason: "sender address is not configured" };
@@ -115,9 +120,7 @@
   };
   if (message.scheduledAt) body["scheduled_at"] = message.scheduledAt;
-
-  const replyTo = process.env["RESEND_REPLY_TO"]?.trim();
   if (replyTo) body["reply_to"] = replyTo;
```

`get_notifier_config()` returns a `Json` blob and does not currently include
`mail_reply_to`, and `set_notifier_secret` restricts names to a closed list that
does not include it. Adding it is a migration, and migrations are out of scope
for this pass. Until then the diff above is behaviour-preserving: `mail_reply_to`
reads as `undefined`, `envReplyTo` is used, and the only change is that the value
resolves in one place instead of two. The migration is a separate decision.

### 4c. Considered and not proposed

**List-Unsubscribe on the welcome email.** It would mean adding an optional
`headers` field to `OutboundEmail` and threading a token through
`src/server/welcome.ts`. It is defensible and it is cheap points with Gmail. It
is also not this problem: the welcome email is transactional and is not what
landed in spam, the unsubscribe-token machinery it should use belongs to the
notifier queue that does not live in this repository, and wiring the application
path into it in passing is exactly the kind of second-path drift the brief warns
against. Left alone deliberately. Raise it when the notifier lands.

---

## 5. Fixable only in Supabase Dashboard config — founder action

**5a. Verify the SMTP sender address.** Authentication, Emails, SMTP Settings.
Confirm the sender email is on `r17gh.com` — `notifications@r17gh.com` matches
the application path and is the sane choice. Anything on another domain means
DKIM does not align and every code email fails DMARC into quarantine. **Check
this first; it is the only remaining candidate for a complete explanation.**

**5b. Align the sender name.** The same screen carries the sender name, currently
"Team Region 17 Ghana" against the application's "Region 17". Two names on one
domain is a small inconsistency signal and a real one for members, who see two
different senders for two messages about the same account. Pick one. "Region 17"
matches the register's voice and the application path.

**5c. Change the two subject lines.** Authentication, Email Templates. Confirm
signup and Magic Link. Use the strings from the diff in 4a. The Dashboard is what
members actually receive; `config.toml` is the record. Do both.

**5d. Give the templates a plain-text alternative if the project offers one.**
GoTrue sends HTML only. If the Dashboard exposes a plain-text body for these
templates, fill it in. If it does not, note it and move on — nothing in this
repository can add one, and building an application-side OTP send to work around
it is the failure mode the brief rules out and this audit endorses ruling out.

---

## 6. Fixable only in Resend or DNS config — founder action

**6a. Repair the SPF include. This is the concrete misconfiguration.** Priority
above everything else in this section.

`send.r17gh.com` publishes `v=spf1 include:dc-fd741b8612._spfm.send.r17gh.com ~all`
and that include target does not exist, so SPF permanently errors. In the Resend
dashboard, open the domain record for `r17gh.com` and re-read the DNS records it
asks for. Either:

- Resend still wants the SPF-managed layout, in which case it will name a
  delegation record for `_spfm.send.r17gh.com` that is missing from Cloudflare —
  add exactly what Resend specifies; or
- replace the record on `send.r17gh.com` with the plain form Resend also
  supports: `v=spf1 include:amazonses.com ~all`

Then re-verify the domain in Resend and confirm from outside that
`dc-fd741b8612._spfm.send.r17gh.com` resolves, or that the include no longer
points at it. Leave the `send.r17gh.com` MX record
(`feedback-smtp.us-east-1.amazonses.com`) alone; it is correct and it is what
carries bounces.

**6b. Publish an SPF record on the apex.** There is none, and `smtp.google.com`
is the MX. Add on `r17gh.com`:

```
v=spf1 include:_spf.google.com ~all
```

Add any other apex sender to that record before publishing, and keep it to a
single TXT record — two SPF records on one name is itself a permerror.

**6c. Confirm Workspace DKIM signing is switched on.** The key is published at
`google._domainkey.r17gh.com`, which proves it was generated, not that signing is
enabled. Google Admin, Apps, Google Workspace, Gmail, Authenticate email. If it
is not started, all staff mail from `@r17gh.com` is also failing DMARC into
quarantine under `p=quarantine`, and nobody has noticed because staff mail mostly
goes to other Workspace tenants.

**6d. Leave DMARC at `p=quarantine`.** It is correctly formed and the `rua`
address is collecting reports. Do not relax it to `p=none` to make the symptom go
away — that hides the failure instead of fixing it, and the aggregate reports
arriving at the Cloudflare `rua` address are the evidence for whether 6a through
6c actually worked. Read one after the change lands.

**6e. Optional, low value: rotate the Resend DKIM key to 2048-bit** if Resend
offers it. 1024 is accepted everywhere. Not worth doing alone.

---

## 7. Not fixable quickly: domain sending reputation

Everything above is real and all of it should be done. None of it will produce a
clean inbox placement this week on its own, and it is worth being honest about
that rather than shipping fixes and expecting the symptom to disappear.

`r17gh.com` is a young domain with effectively no transactional sending history.
Gmail's classifier weighs domain and IP reputation heavily, and a domain with no
history is not neutral — it is unknown, and unknown senders emitting short
HTML-only messages containing numeric codes and a single link are exactly the
profile of a phishing campaign. That is the shape of the problem. Authentication
is table stakes that stops the mail being penalised; it does not build the
reputation that gets it into the inbox.

What actually moves it, in order of effect:

1. **Volume with engagement.** Real members opening the mail and acting on it.
   Registrations are the volume, which is circular — the fix is gated on the
   thing that is broken. This is why the authentication repairs matter now.
2. **Time at a consistent, non-spiky rate.** Weeks, not days. A sudden burst from
   a cold domain scores worse than a steady trickle.
3. **Zero complaints and near-zero bounces.** The suppression logic in
   `sendEmail` already protects this and is doing its job. Leave it alone.
4. **Gmail Postmaster Tools.** Add `r17gh.com` at
   postmaster.google.com — it is free, it takes ten minutes, and it turns "we
   think it is reputation" into a reputation grade and a spam-rate number that
   can be read directly. Without it every claim in this section, including this
   audit's, is inference.

Practical interim measure for the Executive Director specifically and anyone else
who must get in now: have them mark the message Not Spam and add
`notifications@r17gh.com` — or whatever 5a establishes the real sender to be — to
their contacts. That is per-recipient, it does nothing for anyone else, and it is
the difference between a blocked founder and a working one while the rest lands.

---

## Summary

| Finding | Where | Confidence |
|---|---|---|
| Code email is GoTrue, not the application's Resend path | `StepWhoYouAre.tsx:59` | High |
| Live subject is Dashboard-controlled; `config.toml` is record only | `supabase/config.toml:18-27` | High |
| Resend SPF include NXDOMAINs, SPF permanently errors | `send.r17gh.com` TXT | High |
| No SPF record on the apex at all | `r17gh.com` TXT | High |
| DMARC present and correct at `p=quarantine`; passing on DKIM alone | `_dmarc.r17gh.com` | High |
| DKIM published and aligned for the application's From domain | `resend._domainkey.r17gh.com` | High |
| GoTrue sends HTML-only, from a bare fragment template | GoTrue mailer behaviour | High |
| Bare numeric code in the OTP subject | `supabase/config.toml:22` | High |
| Application path always sends both HTML and text | `resend.server.ts:109-115` | High |
| No List-Unsubscribe on any application mail | `resend.server.ts:109-119` | High |
| Reply-to reads env only, unlike every other transport value | `resend.server.ts:118` | High |
| SMTP sender address unverified; could be a total explanation | Dashboard, not readable here | Unresolved |
| Domain reputation is the dominant residual factor | — | Moderate |

Nothing in the sending path was modified. No new email path, template system, or
transport was created. The Turnstile path, the suppression logic, the idempotency
handling, and every migration were left untouched.
