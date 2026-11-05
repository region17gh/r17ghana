import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { IconButton } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { FormStep1 } from "./FormStep1";
import { FormStep2 } from "./FormStep2";
import { usePastHero } from "@/hooks/usePastHero";
import { useInvest } from "./InvestContext";

export function InvestForm() {
  const f = useInvest();
  const title = useRef<HTMLHeadingElement>(null);
  const firstName = f.s1.fullName.trim().split(/\s+/)[0] ?? "";

  // Focus the heading on step change so screen readers announce the new step.
  useEffect(() => { if (f.step > 1 || f.isOpen) title.current?.focus(); }, [f.step, f.isOpen]);

  useEffect(() => {
    if (!f.isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") f.setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [f.isOpen, f]);

  return (
    <section id="invest-form" className="invest-form-wrap" data-open={f.isOpen} aria-labelledby="invest-form-title">
      <div className="invest-form-card">
        <div className="invest-form-close">
          <IconButton icon="x" label="Close the form" variant="ghost" size="lg" onClick={() => f.setOpen(false)} />
        </div>
        {f.step === 3 ? (
          <div className="invest-stack-sm">
            <h2 id="invest-form-title" ref={title} tabIndex={-1} className="invest-form-title">Thank you, {firstName}.</h2>
            <p className="invest-card-text">A member of the R17GH team will reply within three business days.</p>
            <div className="invest-actions">
              <Button variant="gold" size="lg" href="#">Download the investor brief</Button>
              <Button variant="secondary" size="lg" href="/join">Join R17GH</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="r17-eyebrow invest-ink">Step {f.step} of 2</p>
            <h2 id="invest-form-title" ref={title} tabIndex={-1} className="invest-form-title">Tell us what you want to build</h2>
            <p className="invest-card-text">Two quick steps. We reply personally.</p>
            {f.step === 1 ? <FormStep1 /> : <FormStep2 />}
          </>
        )}
      </div>
    </section>
  );
}

export function MobileBar() {
  const f = useInvest();
  const shown = usePastHero(".invest-hero");
  if (f.isOpen) return null;
  return (
    <div className="invest-mobile-bar" data-shown={shown} aria-hidden={!shown} inert={!shown}>
      <Button variant="gold" size="lg" fullWidth onClick={() => f.open()}>Start here</Button>
    </div>
  );
}
