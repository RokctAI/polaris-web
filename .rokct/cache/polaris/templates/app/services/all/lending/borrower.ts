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


// The borrower's side of lending for the web app's /loans area: the same
// gateway cmds the Dart app calls (polaris/docs/web-app.md section 3), each
// already scoped by the backend to the signed-in user's own Customer. No
// staff role is needed or checked here; nothing here can reach another
// borrower's records.

import "server-only";

import { BaseService } from "./base";

/** A Loan Application row as get_my_loan_applications lists it. */
export interface BorrowerApplicationRow {
  name: string;
  status: string;
  loan_product?: string | null;
  loan_amount?: number | null;
  posting_date?: string | null;
  modified?: string | null;
}

/** One application in full, as get_loan_details answers. */
export interface BorrowerApplication extends BorrowerApplicationRow {
  applicant_name?: string | null;
  currency?: string | null;
  rate_of_interest?: number | null;
  repayment_periods?: number | null;
  repayment_amount?: number | null;
  total_payable_amount?: number | null;
  monthly_income?: number | null;
  monthly_expenses?: number | null;
  contract_status?: string | null;
  contract_responded_on?: string | null;
  payout_requested_on?: string | null;
}

export interface ActiveLoan {
  name: string;
  amount_owed: number;
  total_repayable: number;
  due_date: string;
  disbursement_date: string;
}

export interface LoanContract {
  id: string;
  title: string;
  content: string;
  status: string;
}

/** The answer every pre-check gives (api/applications.py _answer). */
export interface PrecheckAnswer {
  is_eligible: boolean;
  status: "eligible" | "ineligible" | "pending";
  reason?: string | null;
  has_disqualifying_history?: boolean;
  max_loan_amount?: number | null;
}

export interface UploadedDocument {
  name: string;
  file_name: string;
  creation?: string;
}

/** What the apply flow sends as `financial_details`. */
export interface ApplicationDetails {
  loan_amount: number;
  monthly_income: number;
  grocery_expenses: number;
  other_expenses: number;
  existing_credits: number;
  id_number?: string;
  phone?: string;
  saved_application_id?: string;
}

async function lending<T>(cmd: string, payload?: Record<string, unknown>) {
  const response = await BaseService.call(`api.lending.${cmd}`, payload ?? {});
  return response?.message as T;
}

export class BorrowerService {
  static activeLoan() {
    return lending<ActiveLoan | null>("get_active_loan");
  }

  static applications() {
    return lending<BorrowerApplicationRow[]>("get_my_loan_applications");
  }

  static drafts() {
    return lending<BorrowerApplicationRow[]>("fetch_saved_applications");
  }

  static details(loanApplication: string) {
    return lending<BorrowerApplication>("get_loan_details", {
      loan_application: loanApplication,
    });
  }

  static contract(loanApplication: string) {
    return lending<LoanContract>("get_loan_contract", {
      loan_application: loanApplication,
    });
  }

  static acceptContract(loanApplication: string) {
    return lending<{ contract_status: string }>("accept_loan_contract", {
      loan_application: loanApplication,
    });
  }

  static declineContract(loanApplication: string) {
    return lending<{ contract_status: string }>("decline_loan_contract", {
      loan_application: loanApplication,
    });
  }

  static requestPayout(loanApplication: string) {
    return lending<{ status: string }>("request_payout", {
      loan_application: loanApplication,
    });
  }

  static cancel(loanApplication: string) {
    return lending<{ status: string }>("cancel_loan_application", {
      loan_application: loanApplication,
    });
  }

  static documents(loanApplication: string) {
    return lending<UploadedDocument[]>("get_application_documents", {
      loan_application: loanApplication,
    });
  }

  static upload(
    loanApplication: string,
    documentType: string,
    filename: string,
    base64: string,
  ) {
    return lending<{ name: string }>("upload_application_document", {
      loan_application: loanApplication,
      document_type: documentType,
      filename,
      file: base64,
    });
  }

  static historyCheck() {
    return lending<PrecheckAnswer>("check_loan_history_eligibility");
  }

  static affordabilityCheck(details: ApplicationDetails) {
    return lending<PrecheckAnswer>("check_financial_eligibility", {
      monthly_income: details.monthly_income,
      grocery_expenses: details.grocery_expenses,
      other_expenses: details.other_expenses,
      existing_credits: details.existing_credits,
    });
  }

  static amountCheck(idNumber: string, amount: number) {
    return lending<PrecheckAnswer>("check_loan_eligibility", {
      id_number: idNumber,
      amount,
    });
  }

  static saveDraft(details: ApplicationDetails) {
    return lending<{ name: string }>("save_incomplete_loan_application", {
      financial_details: details,
    });
  }

  static markDeclined(details: ApplicationDetails, reason: string) {
    return lending<{ status: string }>("mark_application_as_rejected", {
      financial_details: {
        ...details,
        status: "rejected",
        rejection_reason: reason,
      },
    });
  }

  static submit(details: ApplicationDetails) {
    return lending<{ name: string; status: string }>("create_loan_application", {
      financial_details: details,
    });
  }
}
