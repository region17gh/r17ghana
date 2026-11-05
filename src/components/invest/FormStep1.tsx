import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, Radio, Select } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { supabase } from "@/integrations/supabase/client";
import { CONNECTIONS, INVESTOR_TYPES, type InvestorType } from "@/lib/invest/content";
import type { ConnectionType } from "@/lib/join/options";
import { useInvest } from "./InvestContext";

export function FormStep1() {
  const f = useInvest();
  const { s1, setS1, errors, blur1 } = f;
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    void supabase.from("countries").select("name").order("name").then(({ data }) => {
      setCountries((data ?? []).map((c) => ({ value: c.name, label: c.name })));
    });
  }, []);

  return (
    <form noValidate className="invest-stack-sm" onSubmit={(e) => { e.preventDefault(); void f.submit1(); }}>
      {f.brief ? <p className="invest-note">We'll send the brief to your inbox.</p> : null}
      <Field label="Full name" required error={errors.fullName}>
        <Input autoComplete="name" value={s1.fullName} invalid={!!errors.fullName}
          onChange={(e) => setS1((p) => ({ ...p, fullName: e.target.value }))} onBlur={() => blur1("fullName")} maxLength={120} />
      </Field>
      <Field label="Email" required error={errors.email}>
        <Input type="email" autoComplete="email" inputMode="email" value={s1.email} invalid={!!errors.email}
          onChange={(e) => setS1((p) => ({ ...p, email: e.target.value }))} onBlur={() => blur1("email")} maxLength={254} />
      </Field>
      <Field label="Country you live in" required error={errors.country}>
        <Select value={s1.country} invalid={!!errors.country} onBlur={() => blur1("country")}
          onChange={(e) => setS1((p) => ({ ...p, country: e.target.value }))}
          options={[{ value: "", label: "Choose a country" }, ...countries]} />
      </Field>
      <Field label="Your connection to Ghana" required error={errors.connection}>
        <Select value={s1.connection} invalid={!!errors.connection} onBlur={() => blur1("connection")}
          onChange={(e) => setS1((p) => ({ ...p, connection: e.target.value as ConnectionType }))}
          options={[{ value: "", label: "Choose one" }, ...CONNECTIONS]} />
      </Field>
      <fieldset className="invest-fieldset">
        <legend className="invest-legend">I am <span aria-hidden="true">*</span></legend>
        <div className="invest-cards">
          {INVESTOR_TYPES.map((o) => (
            <div key={o.value} className="invest-choice" data-checked={s1.investorType === o.value}>
              <Radio name="investor_type" label={o.label} checked={s1.investorType === o.value}
                onChange={() => setS1((p) => ({ ...p, investorType: o.value as InvestorType }))} />
            </div>
          ))}
        </div>
        {errors.investorType ? <p role="alert" className="invest-error">{errors.investorType}</p> : null}
      </fieldset>
      <div>
        <Checkbox label="R17GH may contact me about my enquiry." checked={s1.consent}
          onChange={(c) => setS1((p) => ({ ...p, consent: c }))} />
        {errors.consent ? <p role="alert" className="invest-error">{errors.consent}</p> : null}
      </div>
      <div className="invest-honeypot" aria-hidden="true">
        <label>Company website<input name="company_website" tabIndex={-1} autoComplete="off"
          value={s1.website} onChange={(e) => setS1((p) => ({ ...p, website: e.target.value }))} /></label>
      </div>
      {f.problem ? <p role="alert" className="invest-error">{f.problem}</p> : null}
      <Button type="submit" variant="gold" size="lg" fullWidth disabled={f.busy} aria-busy={f.busy}>
        {f.busy ? "Saving…" : "Continue"}
      </Button>
    </form>
  );
}
