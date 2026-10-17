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

import { BaseService, ServiceOptions } from "@/app/services/all/lending/base";

export class LifecycleService {
  static async createLoanWriteOff(
    loan: string,
    amount: number,
    options?: ServiceOptions,
  ) {
    const doc = {
      doctype: "Loan Write Off",
      loan: loan,
      write_off_amount: amount,
      posting_date: new Date().toISOString().split("T")[0],
    };
    const res = await BaseService.call(
      "frappe.client.insert",
      { doc: doc },
      options,
    );
    if (res?.message) {
      await BaseService.call(
        "frappe.client.submit",
        { doc: res.message },
        options,
      );
    }
    return res?.message;
  }

  static async createLoanRestructure(
    data: {
      loan: string;
      date: string;
      reason?: string;
      new_term_months?: number;
      new_interest_rate?: number;
    },
    options?: ServiceOptions,
  ) {
    const doc: any = {
      doctype: "Loan Restructure",
      loan: data.loan,
      restructure_type: "Normal Restructure",
      restructure_date: data.date,
      reason_for_restructure: data.reason,
      status: "Initiated",
    };
    if (data.new_term_months)
      doc.new_repayment_period_in_months = data.new_term_months;
    if (data.new_interest_rate)
      doc.new_rate_of_interest = data.new_interest_rate;

    const res = await BaseService.call(
      "frappe.client.insert",
      { doc: doc },
      options,
    );
    if (res?.message) {
      await BaseService.call(
        "frappe.client.submit",
        { doc: res.message },
        options,
      );
    }
    return res?.message;
  }

  static async createBalanceAdjustment(
    data: {
      loan: string;
      amount: number;
      type: "Debit Adjustment" | "Credit Adjustment";
      remarks?: string;
    },
    options?: ServiceOptions,
  ) {
    const doc = {
      doctype: "Loan Balance Adjustment",
      loan: data.loan,
      adjustment_type: data.type,
      amount: data.amount,
      posting_date: new Date().toISOString().split("T")[0],
      remarks: data.remarks,
    };
    const res = await BaseService.call(
      "frappe.client.insert",
      { doc: doc },
      options,
    );
    if (res?.message) {
      await BaseService.call(
        "frappe.client.submit",
        { doc: res.message },
        options,
      );
    }
    return res?.message;
  }
}
