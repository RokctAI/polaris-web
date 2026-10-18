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


// The borrower area of the Polaris web app (polaris/docs/web-app.md section
// 2): what a customer does in the Dart app, in a browser. Signed-out
// visitors go to the login page and come back here (auth_sdk >= 1.9.0
// return path). The session is read through base_sdk's kernel seam, never
// app/(auth) directly. Every cmd behind these pages is scoped by the
// backend to the caller's own Customer.

import { redirect } from "next/navigation";

import { getPlatformSession } from "@/app/services/base/session";
import { AccessService } from "@/app/services/all/lending/access";
import { LoansFrame } from "@/components/custom/lending/loans-frame";

export const dynamic = "force-dynamic";

export default async function LoansLayout({ children }: { children: React.ReactNode }) {
  const session = await getPlatformSession();
  if (!session?.user) redirect("/login?next=/loans");
  const access = await AccessService.get();
  return <LoansFrame isStaff={!!access?.is_staff}>{children}</LoansFrame>;
}
