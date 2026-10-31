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

// The one fetch of the latest Polaris release (1.8.0), shared by the
// download route (./[platform]/route.ts), the availability answer the
// client hero reads (./route.ts) and the server sections that draw the app
// badges (polaris-cta-section.tsx and polaris-footer-section.tsx). It asks the public
// GitHub releases API - no token, the repository is public - through
// Next's data cache with a ten-minute revalidation, so a burst of visitors
// costs one API call and a new release (or a Huawei build added to one) is
// picked up within ten minutes. Server-only: nothing on the client imports
// it. A network error, a rate limit or any non-2xx answer is null, which
// the resolver reads as "no asset" - the Android route falls back to the
// releases page and every badge stays hidden.

import { POLARIS_RELEASES_API, availableDownloads, type DownloadAvailability } from "./[platform]/resolve";

/** How long one API answer serves every visitor, in seconds. */
export const POLARIS_RELEASE_REVALIDATE_SECONDS = 600;

export async function fetchLatestPolarisRelease(): Promise<unknown> {
  try {
    const response = await fetch(POLARIS_RELEASES_API, {
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": "polaris web download route",
      },
      next: { revalidate: POLARIS_RELEASE_REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/** Which platforms the latest release carries a download for; all false when the fetch failed. */
export async function fetchPolarisDownloadAvailability(): Promise<DownloadAvailability> {
  return availableDownloads(await fetchLatestPolarisRelease());
}
