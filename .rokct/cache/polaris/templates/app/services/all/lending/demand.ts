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

export class DemandService {
  static async create(
    data: {
      loan: string;
      demand_type: "Penalty" | "Charges";
      amount: number;
      date: string;
      description?: string;
    },
    options?: ServiceOptions,
  ) {
    // Fetch Loan first to get context, similar to original logic
    const loanDoc = await BaseService.call(
      "frappe.client.get",
      {
        doctype: "Loan",
        name: data.loan,
      },
      options,
    );

    if (!loanDoc?.message) throw new Error("Loan not found");
    const loan = loanDoc.message;

    const doc = {
      doctype: "Loan Demand",
      loan: data.loan,
      demand_type: data.demand_type,
      demand_subtype:
        data.demand_type === "Penalty" ? "Penalty" : "Miscellaneous",
      demand_date: data.date,
      posting_date: data.date,
      demand_amount: data.amount,
      company: loan.company,
      applicant_type: loan.applicant_type,
      applicant: loan.applicant,
      loan_product: loan.loan_product,
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
