import type { ReactNode } from "react";

import { PanBand } from "@/design-system/region-17-ghana-design-system-e3e62f";
import { useI18n } from "@/i18n";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Header, page body and footer, with the fixed non-government line. */
export function PageShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="site-shell">
      <PanBand />
      <SiteHeader />
      <main className="site-main">
        {children}
        <p className="r17-cite site-disclaimer">{t("legal.notAGovernmentDocument")}</p>
      </main>
      <SiteFooter />
    </div>
  );
}
