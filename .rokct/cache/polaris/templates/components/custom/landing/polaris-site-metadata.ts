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
// (components/custom/landing/site-metadata.ts). The name is the lender's
// own when the shell declares one, else the product's (polaris-brand.ts),
// so one SDK serves any lender's site and this one reads "Polaris". The
// shape is written out here, as hosting-site-metadata.ts does, and the
// registry checks the default export structurally. No icon, logo or card
// image: base generates them.

import { POLARIS_BRAND_NAME } from "./polaris-brand";

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
  siteName: POLARIS_BRAND_NAME,
  title: `${POLARIS_BRAND_NAME} — personal loans with the full cost shown first`,
  tagline: "Personal loans with the full cost shown first",
  description:
    "See the most a short-term loan can cost under the National Credit Act before you apply, then apply in your browser: tell us about your money, send the PDF statement from your bank, and accept your contract online. No app to download.",
  keywords: [
    "personal loan",
    "short-term loan",
    "loan calculator",
    "apply online",
    "National Credit Act",
    "bank statement",
  ],
  locale: "en_ZA",
};

export default POLARIS_SITE_METADATA;
