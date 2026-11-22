import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminSignInOptions } from "@/lib/admin-access";

export function useAdminAccess(redirectToPanel = true) {
  const navigate = useNavigate();
  const cache = useQueryClient();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const session = useQuery({ queryKey: ["admin-session"], queryFn: async () => {
    const result = await supabase.auth.getUser();
    return result.data.user;
  }, retry: false });
  useEffect(() => {
    if (session.data && redirectToPanel) void navigate({ to: "/publications", replace: true });
  }, [session.data, navigate, redirectToPanel]);
  async function send() {
    if (busy) return;
    setError(""); setBusy(true);
    try {
      const result = await supabase.auth.signInWithOtp({ email: email.trim(), options: adminSignInOptions(window.location.origin) });
      if (result.error) throw new Error("The sign-in link could not be sent. Please try again.");
      setSent(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Sign-in is unavailable."); }
    finally { setBusy(false); }
  }
  async function signOut() {
    await cache.cancelQueries(); cache.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/admin", replace: true });
  }
  return { email, setEmail, busy, sent, error, send, signOut, session };
}