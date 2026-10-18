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

export class TransferService {
  static async create(
    data: {
      transfer_date: string;
      from_branch: string;
      to_branch: string;
      loans: string[];
      company: string;
      applicant?: string;
    },
    options?: ServiceOptions,
  ) {
    const doc = {
      doctype: "Loan Transfer",
      transfer_date: data.transfer_date,
      company: data.company,
      from_branch: data.from_branch,
      to_branch: data.to_branch,
      applicant: data.applicant,
      loans: data.loans.map((loanId) => ({ loan: loanId })),
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

  static async getLoansByBranch(
    branch: string,
    applicant?: string,
    options?: ServiceOptions,
  ) {
    const filters: any = { branch: branch, docstatus: 1, status: "Active" };
    if (applicant) filters.applicant = applicant;

    const response = await BaseService.call(
      "frappe.client.get_list",
      {
        doctype: "Loan",
        filters: filters,
        fields: ["name", "applicant_name", "loan_amount", "outstanding_amount"],
      },
      options,
    );

    return response?.message || [];
  }

  static async getBranches(options?: ServiceOptions) {
    const response = await BaseService.call(
      "frappe.client.get_list",
      {
        doctype: "Branch",
        fields: ["name"],
      },
      options,
    );
    return response?.message || [];
  }
}
