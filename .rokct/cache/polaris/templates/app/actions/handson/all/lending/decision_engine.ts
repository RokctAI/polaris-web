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
import { revalidatePath } from "next/cache";
import { DecisionService } from "@/app/services/all/lending/decision";

export async function runDecisionEngine(applicationId: string) {
  if (!applicationId)
    return { success: false, message: "Application ID is required" };

  // Auth Check
  if (!(await verifyLendingRole()))
    return { success: false, message: "Unauthorized" };

  try {
    const data = await DecisionService.runEngine(applicationId);
    revalidatePath(`/handson/all/lending/application/${applicationId}`);
    return { success: true, data: data };
  } catch (e: any) {
    console.error("Decision Engine Failed:", e);
    return {
      success: false,
      message: e?.message || "Failed to run decision engine",
    };
  }
}

export async function getLoanQuote(applicationId: string) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const data = await DecisionService.getLoanQuote(applicationId);
    return { success: true, data };
  } catch (e: any) {
    console.error("Load loan quote failed:", e);
    return { success: false, error: e?.message || "Failed to load the quote" };
  }
}

export async function createQuoteLink(applicationId: string) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const data = await DecisionService.createQuoteLink(applicationId);
    return { success: true, data };
  } catch (e: any) {
    console.error("Create quote link failed:", e);
    return { success: false, error: e?.message || "Failed to create the link" };
  }
}

export async function getAffordabilitySettings() {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const data = await DecisionService.getAffordabilitySettings();
    return { success: true, data };
  } catch (e: any) {
    console.error("Load affordability settings failed:", e);
    return { success: false, error: e?.message || "Failed to load limits" };
  }
}

export async function updateAffordabilitySettings(settings: {
  min_disposable_income?: number;
  first_loan_max_amount?: number;
}) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const data = await DecisionService.updateAffordabilitySettings(settings);
    revalidatePath("/handson/all/lending/operations");
    return { success: true, data };
  } catch (e: any) {
    console.error("Save affordability settings failed:", e);
    return { success: false, error: e?.message || "Failed to save limits" };
  }
}

export async function setIncomeOverride(
  applicationId: string,
  key: string,
  action: "income" | "not_income" | "clear",
  reason: string,
) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const data = await DecisionService.setIncomeOverride(
      applicationId,
      key,
      action,
      reason,
    );
    return { success: true, data };
  } catch (e: any) {
    console.error("Save income override failed:", e);
    return { success: false, error: e?.message || "Failed to save the change" };
  }
}

export async function getApplicationStatements(applicationId: string) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const data = await DecisionService.getApplicationStatements(applicationId);
    return { success: true, data };
  } catch (e: any) {
    console.error("Load statements failed:", e);
    return { success: false, error: e?.message || "Failed to load statements" };
  }
}

export async function reparseStatements(applicationId: string) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const data = await DecisionService.reparseStatements(applicationId);
    revalidatePath(`/handson/all/lending/application/${applicationId}`);
    return { success: true, data };
  } catch (e: any) {
    console.error("Re-read statements failed:", e);
    return { success: false, error: e?.message || "Failed to re-read statements" };
  }
}

export async function addStatementText(
  applicationId: string,
  text: string,
  fileName?: string,
) {
  if (!(await verifyLendingRole()))
    return { success: false, error: "Unauthorized" };

  try {
    const data = await DecisionService.addStatementText(applicationId, text, fileName);
    revalidatePath(`/handson/all/lending/application/${applicationId}`);
    return { success: true, data };
  } catch (e: any) {
    console.error("Add statement text failed:", e);
    return { success: false, error: e?.message || "Failed to save the statement text" };
  }
}
