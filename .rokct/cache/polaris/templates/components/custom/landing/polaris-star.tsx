/*
 * Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


// Polaris's mark: a four-point star, the north star the name is, drawn as
// one path in the current colour so it takes the gold of the theme tokens
// wherever it sits. The wordmark pairs it with the name in the display
// face. Both are plain components with no hooks, so a server section and a
// client one can draw them alike.

import React from "react";

import { POLARIS_BRAND_NAME } from "./polaris-brand";

/** The star alone, `size` px square. */
export function PolarisStar({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0c.6 7.2 4.8 11.4 12 12-7.2.6-11.4 4.8-12 12-.6-7.2-4.8-11.4-12-12 7.2-.6 11.4-4.8 12-12Z" />
    </svg>
  );
}

/** The star and the name side by side; the name in the display face. */
export function PolarisWordmark({
  size = 28,
  className,
  name = POLARIS_BRAND_NAME,
}: {
  /** The star's size in px; the name is set to match. */
  size?: number;
  className?: string;
  name?: string;
}) {
  return (
    <span
      className={["inline-flex items-center gap-2 leading-none", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={name}
      title={name}
    >
      <PolarisStar size={Math.round(size * 0.78)} className="text-[var(--px-gold)]" />
      <span
        className="px-display"
        style={{ fontSize: size, fontWeight: 600, letterSpacing: "-0.01em" }}
      >
        {name}
      </span>
    </span>
  );
}

export default PolarisWordmark;
