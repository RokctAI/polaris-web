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

// GET /download: which mobile builds the latest Polaris release carries,
// as { "android": boolean, "huawei": boolean } (1.8.0). The check is the
// server's - ./release.ts, the same cached fetch the download route makes -
// and this is how the hero reads it: base_sdk renders the registered hero
// form as a client component with no server data of its own, so
// landing/polaris-hero-form.tsx asks here once and draws a badge only for
// a true. A failed fetch answers all false, so no badge is drawn.

import { NextResponse } from "next/server";

import { fetchPolarisDownloadAvailability } from "./release";

export async function GET() {
  const available = await fetchPolarisDownloadAvailability();
  return NextResponse.json(available, {
    headers: { "cache-control": "public, max-age=60" },
  });
}
