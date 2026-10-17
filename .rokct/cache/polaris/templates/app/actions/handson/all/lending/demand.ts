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
import { DemandService } from "@/app/services/all/lending/demand";

export async function createLoanDemand(data: {
  loan: string;
  demand_type: "Penalty" | "Charges";
  amount: number;
  date: string;
  description?: string; // Mapped to demand_subtype usually or remarks
}) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const message = await DemandService.create(data);
    return { success: true, message: `Demand Raised (${message.name})` };
  } catch (e: any) {
    console.error("Demand Creation Failed", e);
    return { success: false, error: e.message || "Failed to raise demand" };
  }
}
