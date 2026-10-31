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


// The one place the Polaris landing takes its name from. A lender's shell
// names itself through NEXT_PUBLIC_SITE_NAME (app/site.ts -> PLATFORM_NAME),
// so one SDK still serves any lender's site; a shell that left the name at
// its app_type (polaris, polaris-web - the spawn's slug, not a brand) reads
// "Polaris", the product's own name (Ray, 2026-10-18: "the site is polaris
// not polaris-web"). Import-free beside the host seam, so the server
// modules and the client ones share it.

import { PLATFORM_NAME } from "@/app/config/platform";

/** The product's name, when the shell declares none of its own. */
export const POLARIS_PRODUCT_NAME = "Polaris";

/** The spawn slugs that are not a lender's name: the app_type and the repo's. */
const APP_TYPE_NAMES = /^polaris([-_ ]?web)?$/i;

/** The name the landing prints: the shell's, unless it is still the app_type. */
export function polarisBrandName(platformName: string = PLATFORM_NAME): string {
  const trimmed = platformName.trim();
  if (!trimmed || APP_TYPE_NAMES.test(trimmed)) return POLARIS_PRODUCT_NAME;
  return trimmed;
}

export const POLARIS_BRAND_NAME = polarisBrandName();

/** The line under the wordmark; the north star the name is. */
export const POLARIS_MOTTO = "Your north star for credit.";
