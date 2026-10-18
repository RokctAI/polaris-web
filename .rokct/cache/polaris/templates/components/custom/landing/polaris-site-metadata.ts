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


// The Polaris web app's site metadata, for base_sdk's site-metadata registry
// (components/custom/landing/site-metadata.ts). The lender's name is the
// shell's own (PLATFORM_NAME, host config), so one SDK serves any lender's
// site. The shape is written out here, as hosting-site-metadata.ts does,
// and the registry checks the default export structurally. No icon, logo or
// card image: base generates them.

import { PLATFORM_NAME } from "@/app/config/platform";

/** The subset of base_sdk's SiteMetadataCopy this module fills. */
export interface PolarisSiteMetadata {
  title: string;
  description: string;
  tagline: string;
  siteName?: string;
  keywords?: string[];
  locale?: string;
}

const POLARIS_SITE_METADATA: PolarisSiteMetadata = {
  siteName: PLATFORM_NAME,
  title: `${PLATFORM_NAME} — personal loans, applied for online`,
  tagline: "Personal loans, applied for online",
  description:
    "Apply for a personal loan in your browser: tell us your income and expenses, upload your ID and the bank statement PDF from your bank, and accept your contract online. No app to download.",
  keywords: ["personal loan", "apply online", "loan application", "bank statement"],
  locale: "en_ZA",
};

export default POLARIS_SITE_METADATA;
