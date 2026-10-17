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


// Server actions for the borrower pages under /loans (polaris/docs/web-app.md
// section 4). Each answers { ok, data } or { ok: false, error } with a line
// a borrower can read; the gateway does not hand back the backend's own
// message, so each action says what failed in its own words. Documents are
// uploaded through the route handler app/api/lending/documents, not here:
// a server action's request body is capped at 1 MB unless the shell raises
// it, and a bank statement PDF is often larger.

"use server";

import { revalidatePath } from "next/cache";

import {
  BorrowerService,
  type ApplicationDetails,
  type PrecheckAnswer,
} from "@/app/services/all/lending/borrower";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function attempt<T>(work: () => Promise<T>, error: string): Promise<Result<T>> {
  try {
    return { ok: true, data: await work() };
  } catch (e) {
    console.error(`[loans] ${error}`, e);
    return { ok: false, error };
  }
}

function cleanDetails(details: ApplicationDetails): ApplicationDetails {
  const money = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : 0;
  };
  return {
    loan_amount: money(details.loan_amount),
    monthly_income: money(details.monthly_income),
    grocery_expenses: money(details.grocery_expenses),
    other_expenses: money(details.other_expenses),
    existing_credits: money(details.existing_credits),
    id_number: (details.id_number ?? "").replace(/\s+/g, "").slice(0, 20) || undefined,
    phone: (details.phone ?? "").trim().slice(0, 20) || undefined,
    saved_application_id: details.saved_application_id || undefined,
  };
}

/** Step 1: the loan book, then affordability on the figures typed. */
export async function checkAffordability(
  details: ApplicationDetails,
): Promise<Result<PrecheckAnswer>> {
  const clean = cleanDetails(details);
  return attempt(async () => {
    const history = await BorrowerService.historyCheck();
    if (history?.status === "ineligible") return history;
    return BorrowerService.affordabilityCheck(clean);
  }, "We could not check your figures right now. Please try again.");
}

/** Step 2: the amount against the product maximum, with the ID number. */
export async function checkAmount(
  details: ApplicationDetails,
): Promise<Result<PrecheckAnswer>> {
  const clean = cleanDetails(details);
  if (!clean.id_number) return { ok: false, error: "Enter your ID number." };
  return attempt(
    () => BorrowerService.amountCheck(clean.id_number as string, clean.loan_amount),
    "We could not check the amount right now. Please try again.",
  );
}

/** Saves (or updates) the borrower's draft; answers its name. */
export async function saveDraft(details: ApplicationDetails): Promise<Result<string>> {
  const clean = cleanDetails(details);
  if (clean.loan_amount <= 0) return { ok: false, error: "Enter the amount you need." };
  return attempt(async () => {
    const saved = await BorrowerService.saveDraft(clean);
    revalidatePath("/loans");
    return saved.name;
  }, "We could not save your application. Please try again.");
}

/** Keeps a failed pre-check on file, as the Dart app does. */
export async function recordDeclined(
  details: ApplicationDetails,
  reason: string,
): Promise<Result<null>> {
  const clean = cleanDetails(details);
  return attempt(async () => {
    await BorrowerService.markDeclined(clean, reason.slice(0, 500));
    return null;
  }, "We could not record this check.");
}

/** Step 3: submits the application; answers its name. */
export async function submitApplication(
  details: ApplicationDetails,
): Promise<Result<string>> {
  const clean = cleanDetails(details);
  if (clean.loan_amount <= 0) return { ok: false, error: "Enter the amount you need." };
  return attempt(async () => {
    const created = await BorrowerService.submit(clean);
    revalidatePath("/loans");
    return created.name;
  }, "We could not submit your application. Please try again.");
}

export async function acceptContract(loanApplication: string): Promise<Result<null>> {
  return attempt(async () => {
    await BorrowerService.acceptContract(loanApplication);
    revalidatePath(`/loans/${loanApplication}`);
    return null;
  }, "We could not record your acceptance. Refresh the page and try again.");
}

export async function declineContract(loanApplication: string): Promise<Result<null>> {
  return attempt(async () => {
    await BorrowerService.declineContract(loanApplication);
    revalidatePath(`/loans/${loanApplication}`);
    return null;
  }, "We could not record your answer. Refresh the page and try again.");
}

export async function requestPayout(loanApplication: string): Promise<Result<null>> {
  return attempt(async () => {
    await BorrowerService.requestPayout(loanApplication);
    revalidatePath(`/loans/${loanApplication}`);
    return null;
  }, "We could not request the payout. Refresh the page and try again.");
}

export async function cancelApplication(loanApplication: string): Promise<Result<null>> {
  return attempt(async () => {
    await BorrowerService.cancel(loanApplication);
    revalidatePath("/loans");
    revalidatePath(`/loans/${loanApplication}`);
    return null;
  }, "Only an application that has not been decided yet can be cancelled.");
}
