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


// Polaris's two faces, loaded through next/font/google so the host serves
// them itself (no third-party request at run time) and exposes them as CSS
// variables. Fraunces, a soft old-style serif with a true italic, is the
// display face: the headlines, the rotating word, the rand figures of the
// calculator. Manrope, a geometric sans, is the text face. Neither is a face
// another Rokct shell wears (Supacharge: Montserrat and Inter; the platform:
// Geist), which is the point - a lender's site should not read as a sibling
// of a school's (Ray, 2026-10-18: Next.js sites are portfolio pieces, "so
// they dont need to shout we from same family").
//
// Server-safe on purpose: next/font must be called in a module the server
// evaluates, and base_sdk reads the landing's `meta.rootClass` in the
// server render (components/custom/landing/page-sections.ts), where the
// variable class names below are joined onto the landing root.

// v3 adds two faces, each with one job: Inter draws the product's own
// screens (the Polaris app's face, so a window on the landing reads as the
// app it is), and IBM Plex Mono the section indices and small labels - the
// editorial grid the v3 layout hangs on.

import { Fraunces, IBM_Plex_Mono, Inter, Manrope } from "next/font/google";

export const polarisDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--px-font-fraunces",
  display: "swap",
});

export const polarisSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--px-font-manrope",
  display: "swap",
});

export const polarisUi = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--px-font-inter",
  display: "swap",
});

export const polarisMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--px-font-plex-mono",
  display: "swap",
});
