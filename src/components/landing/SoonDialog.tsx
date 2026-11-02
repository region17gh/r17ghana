import { forwardRef } from "react";

import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n";

/** Native modal shown until the Zoom details are configured. */
export const SoonDialog = forwardRef<HTMLDialogElement>(function SoonDialog(_, ref) {
  const { t } = useI18n();
  return (
    <dialog
      ref={ref}
      aria-labelledby="soon-title"
      style={{
        maxWidth: "var(--measure-narrow)",
        padding: "var(--space-6)",
        borderRadius: "var(--radius-card)",
        borderWidth: "var(--border-width)",
        borderStyle: "solid",
        borderColor: "var(--border-hairline)",
        background: "var(--paper-000)",
        color: "var(--ink-900)",
        boxShadow: "var(--shadow-3)",
      }}
    >
      <form method="dialog" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <h2 id="soon-title" style={{ margin: "var(--space-0)", font: "var(--type-title)", color: "var(--ink-900)" }}>{t("virtual.soonTitle")}</h2>
        <p style={{ margin: "var(--space-0)", font: "var(--type-body)", color: "var(--ink-700)" }}>{t("virtual.soonBody")}</p>
        <div>
          <Button type="submit" variant="primary" size="lg" autoFocus>{t("virtual.soonClose")}</Button>
        </div>
      </form>
    </dialog>
  );
});
