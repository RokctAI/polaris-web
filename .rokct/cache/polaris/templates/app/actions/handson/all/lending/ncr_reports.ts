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

"use server";

import { verifyLendingRole, verifyLendingLicense } from "@/app/actions/handson/all/lending/access";
import { NCRService } from "@/app/services/all/lending/ncr";
import type { NCRForm40Data } from "@/app/services/all/lending/ncr";

export async function getNCRForm40Data(filters: any = {}) {
  if (!(await verifyLendingRole())) {
    if (!(await verifyLendingLicense()))
      return {
        data: null,
        error: "Company must be a registered Credit Provider.",
      };
    return { data: null, error: "Unauthorized" };
  }

  try {
    const data = await NCRService.getForm40Data(filters);
    return { data, error: null };
  } catch (e: any) {
    console.error("NCR Data Fetch Error", e);
    return { data: null, error: e?.message || "Failed to generate NCR data" };
  }
}
