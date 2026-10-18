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
// copyright holder (the shell's legal entity, app/config/constants.ts), the
// version of the landing - this SDK's, kept in step with
// polaris/nextjs/manifest.json on every release, unless the shell tracks
// its own through NEXT_PUBLIC_APP_VERSION - and the status dot's colours in
// the theme's tokens. No downloads: there is no app to download, which is
// the point of the web app.

import { LEGAL_COMPANY_NAME } from "@/app/config/platform";
import type { FooterChromeConfig } from "@/components/custom/landing/footer-chrome-config";

export const POLARIS_LANDING_VERSION = "1.7.0";

export const POLARIS_FOOTER_CHROME: FooterChromeConfig = {
  copyrightHolder: LEGAL_COMPANY_NAME,
  version: process.env.NEXT_PUBLIC_APP_VERSION || POLARIS_LANDING_VERSION,
  statusColors: {
    operational: "var(--px-green)",
    maintenance: "var(--px-gold)",
    offline: "var(--px-red)",
    checking: "var(--px-ink-3)",
  },
};
