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

export class ApplicationService {
  static async getList(page = 1, limit = 20, options?: ServiceOptions) {
    const start = (page - 1) * limit;
    const response = await BaseService.call(
      "frappe.client.get_list",
      {
        doctype: "Loan Application",
        fields: [
          "name",
          "applicant",
          "applicant_type",
          "loan_amount",
          "status",
          "loan_product",
          "posting_date",
          "rate_of_interest",
          "owner",
          "contract_status",
          "payout_requested_on",
          // Loan Application has no workflow_state or risk_level column;
          // the list page falls back to status and hides the risk badge.
        ],
        limit_start: start,
        limit_page_length: limit,
        order_by: "creation desc",
      },
      options,
    );

    const countRes = await BaseService.call(
      "frappe.client.get_value",
      {
        doctype: "Loan Application",
        filters: {},
        fieldname: "count(name) as total",
      },
      options,
    );

    return {
      data: response?.message || [],
      total: countRes?.message?.total || 0,
      page,
      limit,
    };
  }

  static async get(id: string, options?: ServiceOptions) {
    const response = await BaseService.call(
      "frappe.client.get",
      {
        doctype: "Loan Application",
        name: id,
      },
      options,
    );
    return response?.message;
  }

  static async create(data: any, options?: ServiceOptions) {
    const response = await BaseService.call(
      "frappe.client.insert",
      {
        doc: { doctype: "Loan Application", ...data },
      },
      options,
    );
    return response?.message;
  }

  static async update(name: string, data: any, options?: ServiceOptions) {
    const response = await BaseService.call(
      "frappe.client.set_value",
      {
        doctype: "Loan Application",
        name: name,
        fieldname: data,
      },
      options,
    );
    return response?.message;
  }

  static async uploadDocument(
    applicationId: string,
    documentType: string,
    filename: string,
    base64: string,
    options?: ServiceOptions,
  ) {
    const response = await BaseService.call(
      "api.lending.upload_application_document",
      {
        loan_application: applicationId,
        document_type: documentType,
        filename,
        file: base64,
      },
      options,
    );
    return response?.message;
  }

  static async getDocuments(applicationId: string, options?: ServiceOptions) {
    const response = await BaseService.call(
      "api.lending.get_application_documents",
      { loan_application: applicationId },
      options,
    );
    return response?.message ?? [];
  }
}
