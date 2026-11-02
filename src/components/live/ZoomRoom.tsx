import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useI18n } from "@/i18n";
import { FEATURED_EVENT, eventPhase } from "@/lib/event";
import { loadZoomClient, zoomJoinRefused } from "@/lib/zoom-client";
import type { ZoomJoin } from "@/lib/zoom.functions";

type Ready = Extract<ZoomJoin, { ready: true }>;

/** Browser-only: brings in the Zoom Meeting SDK on demand and joins as an attendee. */
export default function ZoomRoom({ join }: { join: Ready }) {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "joined" | "refused" | "failed">("idle");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => () => { root.current?.replaceChildren(); }, []);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const phase = eventPhase(now, FEATURED_EVENT.virtual.opensAt, FEATURED_EVENT.virtual.closesAt);

  async function start() {
    if (!root.current || !name.trim()) return;
    setState("loading");
    try {
      const client = await loadZoomClient();
      await client.init({ zoomAppRoot: root.current, language: "en-US", patchJsMedia: true });
      await client.join({ signature: join.signature, meetingNumber: join.meetingNumber, password: join.passcode, userName: name.trim() });
      setState("joined");
    } catch (e) {
      const code = zoomJoinRefused(e);
      if (code !== undefined) console.error("R17_ZOOM_JOIN refused", code);
      setState(code === undefined ? "failed" : "refused");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {state !== "joined" && phase === "upcoming" && (
        <p role="status" style={{ margin: "var(--space-0)", font: "var(--type-body)", color: "var(--ink-900)" }}>{t("virtual.notOpenYet")}</p>
      )}
      {state !== "joined" && phase === "past" && (
        <p role="status" style={{ margin: "var(--space-0)", font: "var(--type-body)", color: "var(--ink-900)" }}>{t("virtual.past")}</p>
      )}
      {state !== "joined" && (
        <form onSubmit={(e) => { e.preventDefault(); void start(); }} style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--space-3)" }}>
          <Field label={t("virtual.nameLabel")}>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" maxLength={60} required />
          </Field>
          <Button type="submit" variant="gold" size="lg" disabled={state === "loading" || !name.trim()}>{t("virtual.join")}</Button>
        </form>
      )}
      {state === "loading" && <p role="status" style={{ margin: "var(--space-0)", font: "var(--type-body)", color: "var(--ink-700)" }}>{t("virtual.loading")}</p>}
      {state === "refused" && <p role="alert" style={{ margin: "var(--space-0)", font: "var(--type-body)", color: "var(--ink-900)" }}>{t("virtual.notOpenYet")}</p>}
      {state === "failed" && <p role="alert" style={{ margin: "var(--space-0)", font: "var(--type-body)", color: "var(--ink-900)" }}>{t("virtual.failed")}</p>}
      <div ref={root} style={{ width: "100%" }} />
    </div>
  );
}
