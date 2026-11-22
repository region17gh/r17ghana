import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLiveBostonQuestions() {
  const cache = useQueryClient();
  useEffect(() => {
    const refresh = () => { void cache.invalidateQueries({ queryKey: ["boston-published-questions"] }); };
    const channel = supabase.channel(`boston-public-questions-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "boston_live_questions" }, refresh)
      .subscribe((status) => { if (status === "SUBSCRIBED") refresh(); });
    return () => { void supabase.removeChannel(channel); };
  }, [cache]);
}