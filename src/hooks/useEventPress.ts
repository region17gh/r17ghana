import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { publishedPress } from "@/lib/press-publication.functions";

export function useEventPress() {
  const read = useServerFn(publishedPress);
  return useQuery({ queryKey: ["published-event-press"], queryFn: () => read(), retry: false });
}