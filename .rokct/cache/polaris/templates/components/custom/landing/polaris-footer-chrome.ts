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


// What base_sdk's FooterChromeRow prints under the Polaris footer: the
// fleetwide site credit, "© <year> Polaris · Built with ♥ by ROKCT"
// (base_sdk >= 1.54.0 SiteCredit, named by POLARIS_BRAND_NAME), the
// version of the landing - this SDK's, kept in step with
// polaris/nextjs/manifest.json on every release, unless the shell tracks
// its own through NEXT_PUBLIC_APP_VERSION - and the status dot's colours in
// the theme's tokens. No downloads in this row: the store badges are drawn
// by the footer section itself (polaris-store-badges.tsx), from the
// landing config's `app` block.

import { POLARIS_BRAND_NAME } from "./polaris-brand";
import type { FooterChromeConfig } from "@/components/custom/landing/footer-chrome-config";

export const POLARIS_LANDING_VERSION = "1.8.1";

export const POLARIS_FOOTER_CHROME: FooterChromeConfig = {
  siteName: POLARIS_BRAND_NAME,
  version: process.env.NEXT_PUBLIC_APP_VERSION || POLARIS_LANDING_VERSION,
  statusColors: {
    operational: "var(--px-lime)",
    maintenance: "var(--px-brass)",
    offline: "var(--px-red)",
    checking: "var(--px-ink-3)",
  },
};
