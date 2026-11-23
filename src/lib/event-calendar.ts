import { ROUNDS, type Round } from "@/lib/rounds";

/** Keep ongoing events available until their published end time. */
export function upcomingEvents(now: number, rounds: readonly Round[] = ROUNDS): Round[] {
  return rounds.filter((event) => event.end > now).sort((a, b) => a.start - b.start);
}

export function calendarDate(event: Round) {
  const timeZone = event.timeZone;
  const date = new Date(event.start);
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone, ...options }).format(date);
  const time = (ms: number) => new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(ms);
  const zone = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value ?? timeZone;
  return {
    month: format({ month: "short" }), day: format({ day: "numeric" }),
    monthYear: format({ month: "long", year: "numeric" }),
    fullDate: format({ weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    time: `${time(event.start)} to ${time(event.end)} ${zone}`,
    gmt: `${new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" }).format(event.start)} to ${new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" }).format(event.end)} GMT`,
  };
}

export function calendarMonths(events: readonly Round[]) {
  const groups = new Map<string, Round[]>();
  for (const event of events) {
    const month = calendarDate(event).monthYear;
    const group = groups.get(month) ?? [];
    group.push(event);
    groups.set(month, group);
  }
  return [...groups].map(([month, items]) => ({ month, items }));
}