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
import { LifecycleService } from "@/app/services/all/lending/lifecycle";

export async function createLoanWriteOff(loan: string, amount: number) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const res = await LifecycleService.createLoanWriteOff(loan, amount);
    return { success: true, message: `Acc. ${loan} Written Off (${res.name})` };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createLoanRestructure(data: {
  loan: string;
  date: string;
  reason?: string;
  // Simple restructure params (usually just modifying terms)
  new_term_months?: number;
  new_interest_rate?: number;
}) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };
  try {
    const res = await LifecycleService.createLoanRestructure(data);
    return { success: true, message: `Loan Restructured (${res.name})` };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createBalanceAdjustment(data: {
  loan: string;
  amount: number;
  type: "Debit Adjustment" | "Credit Adjustment";
  remarks?: string;
}) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };
  try {
    const res = await LifecycleService.createBalanceAdjustment(data);
    return { success: true, message: `Adjustment Posted (${res.name})` };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
