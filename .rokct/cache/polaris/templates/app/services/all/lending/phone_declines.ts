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

// Staff list of applicants the borrower app turned away before any Loan
// Application existed: the app's "not eligible" result, or the borrower
// declining the offered amount. The backend keeps each as a Loan
// Eligibility Check with check_type "client_declined"
// (polaris/frappe applications.mark_application_as_rejected). The figures
// are what the borrower typed on the phone and were never checked against
// statements.

import { BaseService, ServiceOptions } from "@/app/services/all/lending/base";

export class PhoneDeclineService {
  static async getList(page = 1, limit = 50, options?: ServiceOptions) {
    const start = (page - 1) * limit;
    const response = await BaseService.call(
      "frappe.client.get_list",
      {
        doctype: "Loan Eligibility Check",
        filters: { check_type: "client_declined" },
        fields: [
          "name",
          "customer",
          "user",
          "status",
          "loan_amount",
          "monthly_income",
          "monthly_expenses",
          "reasons",
          "creation",
        ],
        limit_start: start,
        limit_page_length: limit,
        order_by: "creation desc",
      },
      options,
    );
    return { data: response?.message || [], page, limit };
  }
}
