import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Select, Textarea } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { ANY_REGION, SECTORS, SECTOR_OTHER, SUPPORT, TICKETS, TIMELINES } from "@/lib/invest/content";
import { REGIONS_ALPHABETICAL } from "@/lib/regions";
import { ChipGroup } from "./ChipGroup";
import { useInvest } from "./InvestContext";

const SECTOR_OPTIONS = [...SECTORS.map(({ value, label }) => ({ value, label })), SECTOR_OTHER];
const REGION_OPTIONS = [...REGIONS_ALPHABETICAL.map((r) => ({ value: r.slug, label: r.name })), ANY_REGION];

export function FormStep2() {
  const f = useInvest();
  const { s2, setS2 } = f;
  const project = f.s1.investorType === "ghana_project";

  return (
    <form noValidate className="invest-stack-sm" onSubmit={(e) => { e.preventDefault(); void f.submit2(); }}>
      {f.brief ? <p className="invest-note" role="status">Your brief is on its way.</p> : null}
      <p className="invest-card-text">The more you share, the better our introductions.</p>
      <Field label={project ? "Capital you are seeking (USD)" : "Amount you are considering (USD)"}>
        <Select value={s2.ticket} onChange={(e) => setS2((p) => ({ ...p, ticket: e.target.value }))}
          options={[{ value: "", label: "Choose an amount" }, ...TICKETS]} />
      </Field>
      <ChipGroup legend="Sectors of interest" options={SECTOR_OPTIONS} value={s2.sectors} onChange={(v) => setS2((p) => ({ ...p, sectors: v }))} />
      <ChipGroup legend="Regions of interest" options={REGION_OPTIONS} value={s2.regions} onChange={(v) => setS2((p) => ({ ...p, regions: v }))} />
      <Field label="Timeline">
        <Select value={s2.timeline} onChange={(e) => setS2((p) => ({ ...p, timeline: e.target.value }))}
          options={[{ value: "", label: "Choose a timeline" }, ...TIMELINES]} />
      </Field>
      <ChipGroup legend="How can we help?" options={SUPPORT} value={s2.support} onChange={(v) => setS2((p) => ({ ...p, support: v }))} />
      <Field label="Anything else we should know?" hint={`${s2.message.length} of 600 characters`}>
        <Textarea maxLength={600} value={s2.message} onChange={(e) => setS2((p) => ({ ...p, message: e.target.value }))} />
      </Field>
      <Checkbox label="Send me R17GH investment updates and event invitations." checked={s2.updates}
        onChange={(c) => setS2((p) => ({ ...p, updates: c }))} />
      {f.problem ? <p role="alert" className="invest-error">{f.problem}</p> : null}
      <Button type="submit" variant="gold" size="lg" fullWidth disabled={f.busy} aria-busy={f.busy}>
        {f.busy ? "Sending…" : "Submit"}
      </Button>
      <div className="invest-row">
        <button type="button" className="invest-link" onClick={() => f.setStep(1)}>Back</button>
        <button type="button" className="invest-link" onClick={f.finish}>Skip for now</button>
      </div>
    </form>
  );
}
