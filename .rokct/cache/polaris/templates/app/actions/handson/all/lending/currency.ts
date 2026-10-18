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


// The currency amounts are shown in: the default Company's, from the
// backend's access answer. Replaces the RokctAI_frontend host's
// app/actions/currency.ts, which read `session.user.company.currency`
// (never set by auth_sdk) and so always answered USD.

"use server";

import { AccessService } from "@/app/services/all/lending/access";

export async function getSessionCurrency() {
  const access = await AccessService.get();
  return access?.currency || "ZAR";
}
