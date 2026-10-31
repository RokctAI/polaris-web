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

// Polaris' Back to top button (polaris_sdk 1.9.0), registered with
// base_sdk >= 1.56.0's style registry
// (components/custom/landing/back-to-top-style.ts) through this SDK's
// polaris flavour integrations, so it is the button on every route of the
// Polaris shell - the landing's framed copy and the root copy alike. Ray,
// 2026-10-31: the button must not look the same on every site; each site
// takes its own design language.
//
// Polaris speaks in calm, confident pills: every call to action is a
// `.px-btn-lime` - fully rounded, lime fill, lime-ink text in Manrope 700
// with a slight negative tracking, a soft lime glow beneath and a quick
// 150ms ease. So the button is that pill, labelled "Top" beside
// Remixicon's chevron, and it reads as one of the page's own buttons.
//
// Every value names a Polaris token, falling back to base's shadcn token
// outside the `.px-landing` scope: --px-lime / --px-lime-ink /
// --px-lime-hover for the fill, ink and hover, --px-font-sans (Manrope via
// next/font/local, polaris-fonts.ts) for the label, and the
// `.px-btn-lime` glow and timing.

import type { BackToTopConfig } from "@/components/custom/landing/back-to-top";

export const POLARIS_BACK_TO_TOP: BackToTopConfig = {
  shape: "pill-with-label",
  icon: "chevron-up",
  position: "bottom-right",
  label: "Top",
  background: "var(--px-lime, hsl(var(--primary)))",
  foreground: "var(--px-lime-ink, hsl(var(--primary-foreground)))",
  hoverBackground: "var(--px-lime-hover, hsl(var(--primary)))",
  hoverForeground: "var(--px-lime-ink, hsl(var(--primary-foreground)))",
  border: "transparent",
  ring: "var(--px-lime, hsl(var(--ring)))",
  radius: "999px",
  size: "2.75rem",
  fontFamily: "var(--px-font-sans, inherit)",
  fontWeight: 700,
  letterSpacing: "-0.01em",
  fontSize: "0.9375rem",
  borderWidth: "0px",
  shadow: "0 10px 30px -12px color-mix(in srgb, var(--px-lime, hsl(var(--primary))) 60%, transparent)",
  duration: "150ms",
  easing: "ease",
};

export default POLARIS_BACK_TO_TOP;
