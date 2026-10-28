import { useEffect, useState, type RefObject } from "react";

/**
 * Whether the fixed masthead is currently sitting over a dark band.
 *
 * The wordmark ships in two colourways: navy and gold for the paper ground,
 * white and gold for the navy bands. The masthead is fixed, so it passes from
 * one ground to the other as the page scrolls and the mark has to follow, or it
 * disappears. An observer with a bottom margin the height of the masthead asks
 * the only question that matters: is a dark band inside the strip the bar
 * actually occupies? The strip is read a little taller than the bar itself so
 * the second colourway has a moment to arrive before the ground turns.
 */
export function useMastheadGround(host: RefObject<HTMLElement | null>) {
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const masthead = root.querySelector<HTMLElement>(".charter-masthead");
    const bands = Array.from(root.querySelectorAll<HTMLElement>(".charter-dark"));
    if (!masthead || bands.length === 0) return;

    let observer: IntersectionObserver | null = null;
    const inside = new Set<Element>();

    const connect = () => {
      observer?.disconnect();
      inside.clear();
      const lead = parseFloat(getComputedStyle(masthead).getPropertyValue("--space-6")) || 0;
      const strip = masthead.getBoundingClientRect().bottom + lead;
      const below = Math.max(0, Math.round(window.innerHeight - strip));
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inside.add(entry.target);
            else inside.delete(entry.target);
          }
          setOnDark(inside.size > 0);
        },
        { rootMargin: `0px 0px -${below}px 0px`, threshold: 0 },
      );
      for (const band of bands) observer.observe(band);
    };

    connect();
    window.addEventListener("resize", connect);
    return () => {
      window.removeEventListener("resize", connect);
      observer?.disconnect();
    };
  }, [host]);

  return onDark;
}
