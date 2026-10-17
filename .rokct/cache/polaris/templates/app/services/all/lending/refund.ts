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

export class RefundService {
  static async create(
    data: { loan: string; amount: number; type: "Excess" | "Security" },
    options?: ServiceOptions,
  ) {
    const doc = {
      doctype: "Loan Refund",
      loan: data.loan,
      applicant_type: "Customer", // To be refetched if needed, but usually handled by backend
      posting_date: new Date().toISOString().split("T")[0],
      refund_amount: data.amount,
      is_excess_amount_refund: data.type === "Excess" ? 1 : 0,
      is_security_amount_refund: data.type === "Security" ? 1 : 0,
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
