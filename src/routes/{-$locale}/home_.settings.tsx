import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { PageShell } from "@/components/site/PageShell";
import { Radio, Switch } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useMemberSettings } from "@/hooks/useMemberSettings";
import { localePath, useI18n } from "@/i18n";
import { CONSENTS } from "@/lib/join/options";

export const Route = createFileRoute("/{-$locale}/home_/settings")({
  head: () => ({ meta: [{ title: "Settings | Region 17" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

const LEVELS = [
  ["hidden", "Only me"],
  ["members", "Other Region 17 members"],
] as const;

function SettingsPage() {
  const { t, locale } = useI18n();
  const { state, active, visibility, toggle, setProfileVisibility } = useMemberSettings();
  const [failed, setFailed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const run = async (p: Promise<boolean>) => setFailed(!(await p));

  return (
    <PageShell>
      <Link to={localePath(locale, "/home")}>Back to my Region 17</Link>
      <h1 ref={heading} tabIndex={-1} className="site-hero-title">Settings and privacy choices</h1>
      {state === "loading" ? <p className="site-meta">Loading your choices</p> : null}
      {state === "signedOut" ? <p className="site-meta"><Link to={localePath(locale, "/signin")}>Sign in</Link> to change your settings.</p> : null}
      {state === "error" ? <p role="alert">We couldn't load your choices. Please try again.</p> : null}
      {state === "ready" ? (
        <>
          <section className="site-section" aria-labelledby="consent-h">
            <h2 id="consent-h" className="site-h2">What we may do</h2>
            <p className="site-meta">Each switch is a record. Turning one off keeps the history and stops it from now on.</p>
            {CONSENTS.map((c) => (
              <div key={c.value}>
                <Switch checked={active.has(c.value)} label={t(`join.consents.${c.key}`)} onChange={(on) => void run(toggle(c.value, on))} />
                <p className="site-meta">{t(`join.consents.${c.key}Note`)}</p>
              </div>
            ))}
          </section>
          <section className="site-section" aria-labelledby="vis-h">
            <h2 id="vis-h" className="site-h2">Who can see your profile</h2>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="site-meta">Separate from the switches above. Starts as only you.</legend>
              {LEVELS.map(([v, label]) => (
                <Radio key={v} name="visibility" label={label} checked={visibility === v} onChange={() => void run(setProfileVisibility(v))} />
              ))}
            </fieldset>
          </section>
          {failed ? <p role="alert">That change didn't save. Please try again.</p> : null}
        </>
      ) : null}
    </PageShell>
  );
}
