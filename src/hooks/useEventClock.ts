import { useEffect, useState } from "react";
import { BOSTON } from "@/lib/boston";

/** Stable initial render, then refresh dates without requiring a page reload. */
export function useEventClock() {
  const [now, setNow] = useState(BOSTON.start - 1);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}