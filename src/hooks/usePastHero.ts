import { useEffect, useState } from "react";

/** True once the element matching `selector` has scrolled fully above the viewport. */
export function usePastHero(selector: string): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = document.querySelector(selector);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [selector]);
  return past;
}
