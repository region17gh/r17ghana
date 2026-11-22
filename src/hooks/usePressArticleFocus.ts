import { useEffect, useRef } from "react";

export function usePressArticleFocus(slug: string) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [slug]);
  return heading;
}