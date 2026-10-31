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

// Which file of the latest Polaris release a platform downloads (1.8.0;
// Ray, 2026-10-31: "do what you did with supacharge-web" for the app link,
// since the Polaris app has no Play listing).
//
// The release lane (RokctAI/polaris) names every asset for its version -
// app-v1.2.12.apk beside app-debug-v1.2.12.apk, app-v1.2.12.aab and the
// Windows installer - so GitHub's version-less releases/latest/download/
// form never resolves. What does resolve is the public releases API: the
// latest release lists its assets, and each platform's file is the one
// whose name matches that platform's pattern. This module is the pure half
// of that, the same shape as lms_sdk's: given the API's JSON, which URL to
// send the visitor to and which badges the landing may draw. It imports
// nothing and reads no environment, so tests/test_download_route.py runs it
// under node as it is; the fetch and its cache are ../release.ts's, the
// redirect ./route.ts's.

/** The releases page, where an Android fallback goes. */
export const POLARIS_RELEASES_PAGE =
  "https://github.com/RokctAI/polaris/releases/latest";

/** The public API for the latest release (no token: the repository is public). */
export const POLARIS_RELEASES_API =
  "https://api.github.com/repos/RokctAI/polaris/releases/latest";

/**
 * The platforms the route serves, by the name in the URL
 * (/download/<platform>), each with the patterns its release asset's name
 * matches and what happens when the latest release has no such asset.
 *
 * Mobile only (Ray, 2026-10-31: "polaris wont have the web app
 * downloadable only the mobile platforms"): the Windows installer the lane
 * also attaches is never offered, so there is no windows entry and
 * /download/windows is a 404 like any other name.
 *
 * - android: app-v<version>.apk - NOT app-debug-v<version>.apk (the debug
 *   build beside it), not the .aab (the Play lane's) and not
 *   app-huawei-v<version>.apk (the pattern needs a digit straight after
 *   "app-v"). With no such asset the route falls back to the releases page.
 * - huawei: app-huawei-v<version>.apk, the agreed name for a Huawei build
 *   in the same release (Ray, 2026-10-31: the Huawei badge shows only when
 *   the release really has one). With no such asset the route answers 404:
 *   it never stands the Android APK in for it.
 *
 * iOS is absent on purpose: no lane builds it and no listing exists. The
 * landing config keeps its slot, disabled.
 */
export const POLARIS_DOWNLOAD_PLATFORMS = {
  android: {
    name: "Android",
    assets: [/^app-v\d[\w.-]*\.apk$/i],
    fallbackToReleasesPage: true,
  },
  huawei: {
    name: "Huawei",
    assets: [/^app-huawei-v\d[\w.-]*\.apk$/i],
    fallbackToReleasesPage: false,
  },
} as const;

export type DownloadPlatform = keyof typeof POLARIS_DOWNLOAD_PLATFORMS;

/** Which platforms the latest release carries a download for. */
export type DownloadAvailability = Record<DownloadPlatform, boolean>;

/** Whether a URL segment names a platform the route serves. */
export function isDownloadPlatform(value: string): value is DownloadPlatform {
  return Object.prototype.hasOwnProperty.call(POLARIS_DOWNLOAD_PLATFORMS, value);
}

/** The fields of the API's release object this module reads. */
export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface Release {
  tag_name?: string;
  html_url?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: ReleaseAsset[];
}

function isHttpsUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("https://");
}

/**
 * The direct download URL for a platform in a release, or null when the
 * release is not a published one, is not shaped like the API's, or carries
 * no asset matching any of the platform's patterns. The JSON arrives from
 * the network, so every field is checked before it is trusted.
 */
export function pickAssetUrl(
  release: unknown,
  platform: DownloadPlatform,
): string | null {
  if (!release || typeof release !== "object") return null;
  const { draft, prerelease, assets } = release as Release;
  if (draft === true || prerelease === true) return null;
  if (!Array.isArray(assets)) return null;
  for (const pattern of POLARIS_DOWNLOAD_PLATFORMS[platform].assets) {
    for (const asset of assets) {
      if (!asset || typeof asset !== "object") continue;
      const { name, browser_download_url } = asset as ReleaseAsset;
      if (typeof name !== "string" || !pattern.test(name)) continue;
      if (!isHttpsUrl(browser_download_url)) continue;
      return browser_download_url;
    }
  }
  return null;
}

export interface DownloadTarget {
  /** Where to send the visitor. */
  url: string;
  /** True when url is the asset itself; false when it is the releases page. */
  direct: boolean;
}

/**
 * Where /download/<platform> sends the visitor: the platform's asset in the
 * latest release when the API answered with one; otherwise, for Android,
 * the releases page (its own html_url when the API gave one, else the fixed
 * page), and for Huawei null - the route's 404, never the Android build.
 */
export function resolveDownload(
  release: unknown,
  platform: DownloadPlatform,
): DownloadTarget | null {
  const asset = pickAssetUrl(release, platform);
  if (asset) return { url: asset, direct: true };
  if (!POLARIS_DOWNLOAD_PLATFORMS[platform].fallbackToReleasesPage) return null;
  const page =
    release && typeof release === "object"
      ? (release as Release).html_url
      : undefined;
  return { url: isHttpsUrl(page) ? page : POLARIS_RELEASES_PAGE, direct: false };
}

/**
 * Which badges the landing may draw: a platform is available only when the
 * latest release really carries its asset. A failed fetch (null), an
 * unpublished release or a broken answer makes every platform unavailable,
 * so no badge is drawn rather than one that leads nowhere.
 */
export function availableDownloads(release: unknown): DownloadAvailability {
  const out = {} as DownloadAvailability;
  for (const platform of Object.keys(POLARIS_DOWNLOAD_PLATFORMS) as DownloadPlatform[]) {
    out[platform] = pickAssetUrl(release, platform) !== null;
  }
  return out;
}
