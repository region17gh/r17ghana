import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { ConnectionType } from "@/lib/join/options";
import type { InvestorType } from "@/lib/invest/content";

export interface Step1 {
  fullName: string;
  email: string;
  country: string;
  connection: ConnectionType | "";
  investorType: InvestorType | "";
  consent: boolean;
  website: string; // honeypot
}
export interface Step2 {
  ticket: string;
  sectors: string[];
  regions: string[];
  timeline: string;
  support: string[];
  message: string;
  updates: boolean;
}
export type Errors = Partial<Record<keyof Step1, string>>;
export interface OpenOptions { region?: string; sector?: string; brief?: boolean }

const DRAFT_KEY = "r17-invest-draft-v1";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const EMPTY1: Step1 = { fullName: "", email: "", country: "", connection: "", investorType: "", consent: false, website: "" };
const EMPTY2: Step2 = { ticket: "", sectors: [], regions: [], timeline: "", support: [], message: "", updates: false };

export function validate1(s: Step1): Errors {
  const e: Errors = {};
  if (!s.fullName.trim()) e.fullName = "Enter your full name.";
  if (!EMAIL_RE.test(s.email.trim())) e.email = "Enter an email address like name@example.com.";
  if (!s.country) e.country = "Choose the country you live in.";
  if (!s.connection) e.connection = "Choose the connection that fits you best.";
  if (!s.investorType) e.investorType = "Choose the option that describes you.";
  if (!s.consent) e.consent = "We need your permission to reply to you.";
  return e;
}

const add = (list: string[], v?: string) => (v && !list.includes(v) ? [...list, v] : list);

function failure(message: string): string {
  if (message.includes("rate_limited")) return "You have sent this a few times already. Please wait 10 minutes and try again.";
  if (message.includes("not_found_or_expired")) return "This enquiry can no longer be updated. Your first step is saved and we will reply.";
  return "We could not save your details. Check your connection and try again.";
}

/** State and saves for the two-step investor form. Lead id and key stay in memory only. */
export function useInvestForm() {
  const [isOpen, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [s1, setS1] = useState<Step1>(EMPTY1);
  const [s2, setS2] = useState<Step2>(EMPTY2);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [brief, setBrief] = useState(false);
  const lead = useRef<{ id: string; token: string } | null>(null);
  const tracking = useRef<Record<string, string | null>>({});

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    tracking.current = {
      utm_source: q.get("utm_source"), utm_medium: q.get("utm_medium"),
      utm_campaign: q.get("utm_campaign"), referrer: document.referrer || null,
    };
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as { s1?: Partial<Step1>; s2?: Partial<Step2> };
        setS1((p) => ({ ...p, ...d.s1, consent: false, website: "" }));
        setS2((p) => ({ ...p, ...d.s2 }));
      }
    } catch { /* ignore a corrupt draft */ }
  }, []);

  useEffect(() => {
    if (step === 3) return;
    const { consent: _c, website: _w, ...keep } = s1;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ s1: keep, s2 }));
  }, [s1, s2, step]);

  // Clear an error the moment its answer is fixed, so the layout never shifts on blur
  // (a shift between press and release made taps land on the wrong option).
  useEffect(() => {
    setErrors((prev) => {
      const now = validate1(s1);
      const next: Errors = {};
      for (const k of Object.keys(prev) as Array<keyof Step1>) if (prev[k] && now[k]) next[k] = now[k];
      return next;
    });
  }, [s1]);

  const open = useCallback((o: OpenOptions = {}) => {
    if (o.brief) setBrief(true);
    if (o.region || o.sector) setS2((p) => ({ ...p, regions: add(p.regions, o.region), sectors: add(p.sectors, o.sector) }));
    setOpen(true);
  }, []);

  const blur1 = (field: keyof Step1) => {
    const e = validate1(s1);
    setErrors((p) => ({ ...p, [field]: e[field] }));
  };

  const submit1 = async () => {
    const e = validate1(s1);
    setErrors(e);
    if (Object.keys(e).length) return false;
    setBusy(true); setProblem(null);
    try {
      if (s1.website) { setStep(2); return true; } // honeypot: accept and discard
      const { data, error } = await supabase.rpc("submit_investor_interest_step1", {
        p_full_name: s1.fullName.trim(), p_email: s1.email.trim(), p_country: s1.country,
        p_connection: s1.connection as ConnectionType, p_investor_type: s1.investorType,
        p_consent_contact: true, p_wants_brief: brief, ...prefix(tracking.current),
      });
      if (error) { setProblem(failure(error.message)); return false; }
      const row = data as { id: string; edit_token: string };
      lead.current = { id: row.id, token: row.edit_token };
      setStep(2);
      return true;
    } finally { setBusy(false); }
  };

  const finish = () => { window.localStorage.removeItem(DRAFT_KEY); setStep(3); };

  const submit2 = async () => {
    if (!lead.current) { finish(); return; }
    setBusy(true); setProblem(null);
    const { error } = await supabase.rpc("complete_investor_interest_step2", {
      p_id: lead.current.id, p_edit_token: lead.current.token,
      p_ticket_band: s2.ticket || undefined, p_sectors: s2.sectors, p_regions: s2.regions,
      p_timeline: s2.timeline || undefined, p_support_needed: s2.support,
      p_message: s2.message || undefined, p_consent_updates: s2.updates,
    });
    setBusy(false);
    if (error) { setProblem(failure(error.message)); return; }
    finish();
  };

  return { isOpen, setOpen, open, step, setStep, s1, setS1, s2, setS2, errors, blur1, busy, problem, brief, submit1, submit2, finish };
}

function prefix(t: Record<string, string | null>) {
  return {
    p_utm_source: t.utm_source ?? undefined, p_utm_medium: t.utm_medium ?? undefined,
    p_utm_campaign: t.utm_campaign ?? undefined, p_referrer: t.referrer ?? undefined,
  };
}

export type InvestForm = ReturnType<typeof useInvestForm>;
