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

// GET /download/<platform>: the direct download of the latest Polaris
// mobile build for that platform (1.8.0; Ray, 2026-10-31: "do what you did
// with supacharge-web"). lms_sdk's route, ported: the landing's app badges
// (POLARIS_LANDING_CONFIG.app.stores) point here; ../release.ts fetches the
// latest release through Next's data cache (ten minutes) and ./resolve.ts
// finds the platform's asset by its name pattern; this answers a 302 to
// it. When the API is unreachable, rate-limited or carries no Android
// build, /download/android 302s to the releases page instead, so that
// button never dead-ends; /download/huawei answers 404 when the release
// has no Huawei build, never the Android one. Any other name - ios,
// windows, the web app - is a 404 (mobile only).
//
// A prefetch is answered with 204 and no redirect: a router or browser
// warming the link must not start a download on the visitor's behalf. The
// badges are plain anchors, so this is a guard, not the normal path.

import { NextResponse } from "next/server";

import { fetchLatestPolarisRelease } from "../release";
import { isDownloadPlatform, resolveDownload } from "./resolve";

function isPrefetch(request: Request): boolean {
  const headers = request.headers;
  return (
    headers.get("next-router-prefetch") === "1" ||
    headers.get("rsc") === "1" ||
    headers.get("purpose") === "prefetch" ||
    (headers.get("sec-purpose") ?? "").includes("prefetch")
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<{ platform: string }> },
) {
  const { platform } = await context.params;
  if (!isDownloadPlatform(platform)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 404 });
  }
  if (isPrefetch(request)) {
    return new NextResponse(null, { status: 204 });
  }
  const release = await fetchLatestPolarisRelease();
  const target = resolveDownload(release, platform);
  if (!target) {
    return NextResponse.json({ error: "No build for this platform" }, { status: 404 });
  }
  return NextResponse.redirect(target.url, {
    status: 302,
    headers: { "cache-control": "no-store" },
  });
}
