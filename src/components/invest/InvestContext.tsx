import { createContext, useContext, type ReactNode } from "react";

import { useInvestForm, type InvestForm } from "@/hooks/useInvestForm";

const Ctx = createContext<InvestForm | null>(null);

export function InvestProvider({ children }: { children: ReactNode }) {
  const form = useInvestForm();
  return <Ctx.Provider value={form}>{children}</Ctx.Provider>;
}

export function useInvest(): InvestForm {
  const v = useContext(Ctx);
  if (!v) throw new Error("useInvest must be used inside InvestProvider");
  return v;
}

/** Scrolls the inline form into view on wide screens and moves focus to its heading. */
export function focusInvestForm() {
  if (!window.matchMedia("(min-width: 860px)").matches) return;
  const el = document.getElementById("invest-form");
  el?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  window.setTimeout(() => document.getElementById("invest-form-title")?.focus(), 300);
}

/** Opens the form: a full-screen sheet on phones, a scroll to the inline form on desktop. */
export function useStart() {
  const { open } = useInvest();
  return (o?: Parameters<InvestForm["open"]>[0]) => {
    open(o);
    focusInvestForm();
  };
}
