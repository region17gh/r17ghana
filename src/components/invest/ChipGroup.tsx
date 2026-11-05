import type { Option } from "@/lib/invest/content";

interface Props {
  legend: string;
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
}

/** Multi-select chips as toggle buttons inside a labelled group. */
export function ChipGroup({ legend, options, value, onChange }: Props) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <fieldset className="invest-fieldset">
      <legend className="invest-legend">{legend}</legend>
      <div className="invest-chips">
        {options.map((o) => (
          <button key={o.value} type="button" className="invest-chip" aria-pressed={value.includes(o.value)} onClick={() => toggle(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
