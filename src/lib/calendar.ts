import { PROGRAM_TITLE, type Segment } from "@/lib/program";

const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

/** iCalendar file (UTC times) for one or more program items. */
export function buildIcs(items: Segment[], now = Date.now()): string {
  const events = items.map((s) => [
    "BEGIN:VEVENT",
    `UID:r17-program-${s.start}@r17gh.com`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(s.start)}`,
    `DTEND:${stamp(s.end)}`,
    `SUMMARY:${esc(s.title)}`,
    `DESCRIPTION:${esc(`${s.lead}. ${PROGRAM_TITLE}. Program: https://r17gh.com/program`)}`,
    `LOCATION:${esc("mHUB, Chicago, Illinois")}`,
    "END:VEVENT",
  ].join("\r\n"));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Region 17 Ghana//Program//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR", ""].join("\r\n");
}

export function downloadIcs(items: Segment[], filename: string) {
  const url = URL.createObjectURL(new Blob([buildIcs(items)], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
