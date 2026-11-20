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
import { PhoneDeclineService } from "@/app/services/all/lending/phone_declines";

export async function getPhoneDeclines(page = 1, limit = 50) {
  if (!(await verifyLendingRole())) {
    if (!(await verifyLendingLicense()))
      return { data: [], error: "Company must be a registered Credit Provider." };
    return { data: [], error: "Unauthorized" };
  }
  try {
    const result = await PhoneDeclineService.getList(page, limit);
    return { data: result.data, page: result.page, limit: result.limit };
  } catch (e) {
    console.error("getPhoneDeclines failed", e);
    return { data: [], error: "Could not load phone declines." };
  }
}
