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

export class DecisionService {
  static async runEngine(applicationId: string, options?: ServiceOptions) {
    const response = await BaseService.call(
      "api.lending.get_credit_score",
      {
        loan_application: applicationId,
      },
      options,
    );
    return response?.message;
  }

  static async getLoanQuote(applicationId: string, options?: ServiceOptions) {
    const response = await BaseService.call(
      "api.lending.get_loan_quote",
      { loan_application: applicationId },
      options,
    );
    return response?.message;
  }

  static async createQuoteLink(applicationId: string, options?: ServiceOptions) {
    const response = await BaseService.call(
      "api.lending.create_quote_link",
      { loan_application: applicationId },
      options,
    );
    return response?.message;
  }

  // Staff count one statement credit as income ("income"), leave it out
  // ("not_income") or undo an earlier change ("clear"). A reason is required.
  static async setIncomeOverride(
    applicationId: string,
    key: string,
    action: "income" | "not_income" | "clear",
    reason: string,
    options?: ServiceOptions,
  ) {
    const response = await BaseService.call(
      "api.lending.set_income_override",
      { loan_application: applicationId, key, action, reason },
      options,
    );
    return response?.message;
  }

  // The application's stored bank statements (api/statements.py): one row
  // per file with bank, holder, period, verdict and whether it was read.
  static async getApplicationStatements(
    applicationId: string,
    options?: ServiceOptions,
  ) {
    const response = await BaseService.call(
      "api.lending.get_application_statements",
      { loan_application: applicationId },
      options,
    );
    return response?.message;
  }

  // Forget the stored statements and read the attached files again.
  static async reparseStatements(applicationId: string, options?: ServiceOptions) {
    const response = await BaseService.call(
      "api.lending.reparse_statements",
      { loan_application: applicationId },
      options,
    );
    return response?.message;
  }

  // Staff paste the text of a statement that could not be read from its file.
  static async addStatementText(
    applicationId: string,
    text: string,
    fileName?: string,
    options?: ServiceOptions,
  ) {
    const response = await BaseService.call(
      "api.lending.add_statement_text",
      { loan_application: applicationId, text, file_name: fileName },
      options,
    );
    return response?.message;
  }

  static async getAffordabilitySettings(options?: ServiceOptions) {
    const response = await BaseService.call(
      "api.lending.get_affordability_settings",
      {},
      options,
    );
    return response?.message;
  }

  static async updateAffordabilitySettings(
    settings: {
      min_disposable_income?: number;
      first_loan_max_amount?: number;
    },
    options?: ServiceOptions,
  ) {
    const response = await BaseService.call(
      "api.lending.update_affordability_settings",
      settings,
      options,
    );
    return response?.message;
  }
}
