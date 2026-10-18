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


// The page that serves `/` in a shell whose home SDK is polaris_sdk (the
// Polaris web app, persona "polaris"; polaris/docs/web-app.md). Same role as
// lms_sdk's app/page.tsx for Supacharge and hosting_sdk's for the hosting
// shell: the home SDK owns the root route. A signed-out visitor goes to
// base_sdk's composed landing at /landing. A signed-in user is sent by what
// the backend says they are (`api.lending.get_my_lending_access`): lending
// staff to the back office, everyone else to their loans - what the Dart app
// does for a customer, in a browser. Installed only through the manifest's
// app_type.polaris block, so a rokctapp host keeps its own `/`.

import { redirect } from "next/navigation";

import { getPlatformSession } from "@/app/services/base/session";
import { AccessService } from "@/app/services/all/lending/access";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getPlatformSession();
  if (!session?.user) redirect("/landing");
  const access = await AccessService.get();
  redirect(access?.is_staff ? "/handson/all/lending" : "/loans");
}
