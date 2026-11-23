import { useEffect, useRef } from "react";
import { useEventClock } from "@/hooks/useEventClock";
import { calendarMonths, upcomingEvents } from "@/lib/event-calendar";

export function useEventCalendar() {
  const now = useEventClock();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return { heading, months: calendarMonths(upcomingEvents(now)) };
}