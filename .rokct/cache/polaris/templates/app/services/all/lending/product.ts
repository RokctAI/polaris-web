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

export class ProductService {
  static async getList(options?: ServiceOptions) {
    // Using existing backend method
    const response = await BaseService.call(
      "api.lending.get_loan_product_list",
      {},
      options,
    );
    return response?.message || [];
  }

  static async get(name: string, options?: ServiceOptions) {
    const response = await BaseService.call(
      "frappe.client.get",
      {
        doctype: "Loan Product",
        name: name,
      },
      options,
    );
    return response?.message;
  }

  static async create(data: any, options?: ServiceOptions) {
    // Create logic for seed product
    // Check existence
    const existing = await BaseService.call(
      "frappe.client.get_value",
      {
        doctype: "Loan Product",
        filters: { product_name: data.product_name },
        fieldname: "name",
      },
      options,
    );

    if (existing?.message?.name) {
      throw new Error("Product already exists.");
    }

    const response = await BaseService.call(
      "frappe.client.insert",
      {
        doc: { doctype: "Loan Product", ...data },
      },
      options,
    );
    return response?.message;
  }

  static async isControlSite(options?: ServiceOptions) {
    const response = await BaseService.call(
      "control.utils.is_control_site",
      {},
      options,
    );
    return response?.message === true;
  }
}
