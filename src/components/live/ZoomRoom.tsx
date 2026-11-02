import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useI18n } from "@/i18n";
import type { ZoomJoin } from "@/lib/zoom.functions";

type Ready = Extract<ZoomJoin, { ready: true }>;

/** Browser-only: loads the Zoom Meeting SDK (component view) on demand. */
export default function ZoomRoom({ join }: { join: Ready }) {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "joined" | "failed">("idle");

  useEffect(() => () => { root.current?.replaceChildren(); }, []);

  async function start() {
    if (!root.current || !name.trim()) return;
    setState("loading");
    try {
      const { default: ZoomMtgEmbedded } = await import("@zoom/meetingsdk/embedded");
      const client = ZoomMtgEmbedded.createClient();
      await client.init({ zoomAppRoot: root.current, language: "en-US", patchJsMedia: true });
      await client.join({ signature: join.signature, meetingNumber: join.meetingNumber, password: join.passcode, userName: name.trim() });
      setState("joined");
    } catch (e) {
      console.error("R17_ZOOM_JOIN", JSON.stringify(e), e);
      setState("failed");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {state !== "joined" && (
        <form onSubmit={(e) => { e.preventDefault(); void start(); }} style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--space-3)" }}>
          <Field label={t("virtual.nameLabel")}>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" maxLength={60} required />
          </Field>
          <Button type="submit" variant="gold" size="lg" disabled={state === "loading" || !name.trim()}>{t("virtual.join")}</Button>
        </form>
      )}
      {state === "loading" && <p role="status" style={{ margin: "var(--space-0)" }}>{t("virtual.loading")}</p>}
      {state === "failed" && <p role="alert" style={{ margin: "var(--space-0)" }}>{t("virtual.failed")}</p>}
      <div ref={root} style={{ width: "100%" }} />
    </div>
  );
}
