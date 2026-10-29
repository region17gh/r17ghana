import React from "react";

import { Button as SystemButton } from "@/design-system/region-17-ghana-design-system-e3e62f";

type ButtonProps = React.ComponentProps<typeof SystemButton>;

/**
 * The design system's Button with the site's rest shadow applied.
 *
 * The library's own Button is vendor code, so it is composed here rather than
 * edited. The shadow is carried as a class, not an inline style, because
 * `:focus-visible` in the design system paints its ring with `box-shadow`: an
 * inline shadow would outrank the ring and silently remove the only visible
 * focus indicator. See src/styles/elevation.css.
 */
export function Button({ className, ...rest }: ButtonProps) {
  return (
    <SystemButton
      {...rest}
      className={className ? `r17-lift ${className}` : "r17-lift"}
    />
  );
}
