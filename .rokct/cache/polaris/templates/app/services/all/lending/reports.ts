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

export class ReportService {
  static async getReport(
    reportName: string,
    filters: any = {},
    options?: ServiceOptions,
  ) {
    const response = await BaseService.call(
      "frappe.desk.query_report.run",
      {
        report_name: reportName,
        filters: filters,
      },
      options,
    );

    return {
      columns: response?.message?.columns || [],
      data: response?.message?.result || [],
      message: response?.message?.message,
    };
  }
}
