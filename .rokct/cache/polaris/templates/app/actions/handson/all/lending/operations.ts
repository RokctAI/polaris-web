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

import { verifyLendingRole } from "@/app/actions/handson/all/lending/access";
import { OperationsService } from "@/app/services/all/lending/operations";

export async function triggerLoanInterestAccrual(postingDate?: string) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    // The backend runs accrual up to today; postingDate is not sent.
    void postingDate;
    const response = await OperationsService.runInterestAccrual();
    return {
      success: true,
      message: `Interest Accrual Processed: ${response?.message ?? "done"}`,
    };
  } catch (e: any) {
    console.error("Interest Accrual Failed", e);
    return {
      success: false,
      error: e.message || "Failed to trigger interest accrual",
    };
  }
}

export async function triggerLoanSecurityShortfall() {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    await OperationsService.runSecurityShortfallCheck();
    return { success: true, message: "Security Shortfall Check Initiated" };
  } catch (e: any) {
    console.error("Shortfall Check Failed", e);
    return {
      success: false,
      error: e.message || "Failed to trigger shortfall check",
    };
  }
}

export async function triggerLoanClassification() {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    await OperationsService.runLoanClassification();
    return { success: true, message: "Loan Classification Process Initiated" };
  } catch (e: any) {
    console.error("Classification Failed", e);
    return {
      success: false,
      error: e.message || "Failed to trigger classification",
    };
  }
}

export async function getProcessLogs(limit = 10) {
  if (!(await verifyLendingRole())) return [];
  try {
    return await OperationsService.getProcessLogs(limit);
  } catch (e) {
    console.error("Failed to fetch logs", e);
    return [];
  }
}
