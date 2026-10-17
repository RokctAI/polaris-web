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

export class OperationsService {
  static async runInterestAccrual(options?: any) {
    // Repointed from the external `lending` app to polaris's own forked
    // Process Loan Interest Accrual (see fork-lending-full-backend-plan.md
    // Phase 6). The old call also passed a `term_loan` kwarg that matched no
    // parameter on either the real upstream function or this one - it would
    // have raised a TypeError against both; dropped as part of this repoint.
    const response = await BaseService.call(
      "api.lending.run_interest_accrual",
      {},
      options,
    );
    return response;
  }

  static async runSecurityShortfallCheck(options?: any) {
    await BaseService.call(
      "api.lending.run_security_shortfall_check",
      {},
      options,
    );
  }

  static async runLoanClassification(options?: any) {
    await BaseService.call(
      "api.lending.run_loan_classification",
      {},
      options,
    );
  }

  static async getProcessLogs(limit = 10, options?: ServiceOptions) {
    const interest = await BaseService.call(
      "frappe.client.get_list",
      {
        doctype: "Process Loan Interest Accrual",
        fields: ["name", "posting_date", "creation", "status", "company"],
        order_by: "creation desc",
        limit_page_length: limit,
      },
      options,
    );

    const shortfall = await BaseService.call(
      "frappe.client.get_list",
      {
        doctype: "Process Loan Security Shortfall",
        fields: ["name", "update_time as posting_date", "creation", "status"],
        order_by: "creation desc",
        limit_page_length: limit,
      },
      options,
    );

    const classification = await BaseService.call(
      "frappe.client.get_list",
      {
        doctype: "Process Loan Classification",
        fields: ["name", "creation", "status"],
        order_by: "creation desc",
        limit_page_length: limit,
      },
      options,
    );

    // Combine and Sort Logic is better done in Service or Action?
    // Service should return raw data or domain objects. Keeping logic here makes it reusable.

    const combined = [
      ...(interest?.message || []).map((d: any) => ({
        ...d,
        type: "Interest Accrual",
      })),
      ...(shortfall?.message || []).map((d: any) => ({
        ...d,
        type: "Security Shortfall",
      })),
      ...(classification?.message || []).map((d: any) => ({
        ...d,
        type: "Classification",
      })),
    ]
      .sort(
        (a: any, b: any) =>
          new Date(b.creation).getTime() - new Date(a.creation).getTime(),
      )
      .slice(0, limit);

    return combined;
  }
}
