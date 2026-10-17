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
import { TransferService } from "@/app/services/all/lending/transfer";

export async function createLoanTransfer(data: {
  transfer_date: string;
  from_branch: string;
  to_branch: string;
  loans: string[]; // List of Loan IDs
  company: string;
  applicant?: string;
}) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const message = await TransferService.create(data);
    return { success: true, message: `Transfer Successful (${message.name})` };
  } catch (e: any) {
    console.error("Loan Transfer Failed", e);
    return { success: false, error: e.message || "Failed to Transfer Loans" };
  }
}

export async function getLoansByBranch(branch: string, applicant?: string) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };
  try {
    const result = await TransferService.getLoansByBranch(branch, applicant);
    return { success: true, data: result };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getBranches() {
  try {
    const result = await TransferService.getBranches();
    return { success: true, data: result };
  } catch (e) {
    return { success: false, data: [] };
  }
}
