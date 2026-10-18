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
import { ReportService } from "@/app/services/all/lending/reports";

export async function getLendingReport(reportName: string, filters: any = {}) {
  if (!(await verifyLendingRole())) {
    // Distinguish why failed
    if (!(await verifyLendingLicense())) {
      return {
        columns: [],
        data: [],
        error: "Company must be a registered Credit Provider.",
      };
    }
    return { columns: [], data: [], error: "Unauthorized" };
  }

  try {
    const result = await ReportService.getReport(reportName, filters);
    return {
      columns: result.columns,
      data: result.data,
      message: result.message,
    };
  } catch (e: any) {
    console.error("Failed to fetch Report", e);
    return {
      columns: [],
      data: [],
      error: e?.message || "Failed to load report",
    };
  }
}
