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

// Polaris's two faces, loaded through next/font so the host serves them
// itself (no third-party request at run time) and exposes them as CSS
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

// Since 1.8.1 every face is a bundled woff2 under ./fonts/polaris/, loaded
// through next/font/local, so the build makes no request to Google Fonts.
// next/font/google failed the supacharge-web Vercel build on main 6449cbd
// twice, when fonts.googleapis.com answered with
// fonts.gstatic.com/l/font?kit=... URLs that Turbopack's next/font/google
// loader cannot resolve ("next/font/google queries have exactly one entry"),
// and polaris-web main a9fd8c3 hit the same Inter error in Actions.
//
// The variable faces (Fraunces, Manrope, Inter) are the google/fonts OFL
// sources, the versions Google Fonts serves, cut to the latin and latin-ext
// characters and the layout features fonts.googleapis.com keeps, with the
// wght axis limited to the weights asked for and every other axis pinned
// where Google pins it (Fraunces opsz 14, SOFT 0, WONK default).
// Google also listed cyrillic, greek and vietnamese faces, fetched only for
// those scripts; text in them now draws in the fallback. IBM Plex Mono
// carries the Reserved Font Name "Plex", so its two static weights ship
// whole (google/fonts' TTFs as woff2, not subset). Licence:
// ./fonts/polaris/OFL.txt (SIL Open Font License 1.1). The metric-matched
// fallback is the one next/font/google drew: Times New Roman for the serif
// Fraunces, Arial (the next/font/local default) for the rest.

import localFont from "next/font/local";

export const polarisDisplay = localFont({
  src: [
    {
      path: "./fonts/polaris/fraunces-wght-300-700.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "./fonts/polaris/fraunces-wght-300-700-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--px-font-fraunces",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const polarisSans = localFont({
  src: [
    {
      path: "./fonts/polaris/manrope-wght-400-800.woff2",
      weight: "400 800",
      style: "normal",
    },
  ],
  variable: "--px-font-manrope",
  display: "swap",
});

export const polarisUi = localFont({
  src: [
    {
      path: "./fonts/polaris/inter-wght-400-700.woff2",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--px-font-inter",
  display: "swap",
});

export const polarisMono = localFont({
  src: [
    {
      path: "./fonts/polaris/ibm-plex-mono-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/polaris/ibm-plex-mono-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--px-font-plex-mono",
  display: "swap",
});
