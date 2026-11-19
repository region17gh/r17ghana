import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { loadPolicyVersions } from "@/lib/join/registration";
import { fetchCurrentMember } from "@/lib/member/membership";

type ConsentType = Database["public"]["Enums"]["consent_type"];
type Level = Database["public"]["Enums"]["visibility_level"];
const SETTINGS_MECHANISM = "settings_v1:switch";
const VIS_COLUMNS = ["identity", "location", "connection", "work", "intent", "standing", "links"] as const;

/**
 * Consents are rows: turning one on inserts a new grant, turning it off sets
 * revoked_at on the live grant (the only change the table allows). Profile
 * visibility is a separate record and is never touched by a consent.
 */
export function useMemberSettings() {
  const [memberId, setMemberId] = useState<string | null>(null);
  const [active, setActive] = useState<Set<ConsentType>>(new Set());
  const [visibility, setVisibility] = useState<Level>("hidden");
  const [state, setState] = useState<"loading" | "signedOut" | "ready" | "error">("loading");

  const load = useCallback(async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return setState("signedOut");
    const member = await fetchCurrentMember().catch(() => null);
    if (!member) return setState("signedOut");
    setMemberId(member.id);
    const [{ data: rows, error }, { data: vis }] = await Promise.all([
      supabase.from("member_consents").select("consent_type").eq("member_id", member.id).is("revoked_at", null),
      supabase.from("member_visibility").select("identity").eq("member_id", member.id).maybeSingle(),
    ]);
    if (error) return setState("error");
    setActive(new Set((rows ?? []).map((r) => r.consent_type)));
    setVisibility(vis?.identity ?? "hidden");
    setState("ready");
  }, []);

  useEffect(() => void load(), [load]);

  const toggle = async (type: ConsentType, on: boolean) => {
    if (!memberId) return false;
    const result = on
      ? await supabase.from("member_consents").insert({
          member_id: memberId, consent_type: type, mechanism: SETTINGS_MECHANISM,
          policy_version: (await loadPolicyVersions()).privacy,
        })
      : await supabase.from("member_consents").update({ revoked_at: new Date().toISOString() })
          .eq("member_id", memberId).eq("consent_type", type).is("revoked_at", null);
    if (result.error) return false;
    await load();
    return true;
  };

  const setProfileVisibility = async (level: Level) => {
    if (!memberId) return false;
    const values = Object.fromEntries(VIS_COLUMNS.map((c) => [c, level]));
    const { error } = await supabase.from("member_visibility").upsert({ member_id: memberId, ...values });
    if (error) return false;
    setVisibility(level);
    return true;
  };

  return { state, active, visibility, toggle, setProfileVisibility };
}
