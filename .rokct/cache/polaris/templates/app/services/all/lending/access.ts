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


// Who the signed-in user is to lending, from the backend's
// `api.lending.get_my_lending_access` (polaris/docs/web-app.md section 3).
// The Polaris home route asks it to send staff to the back office and
// borrowers to /loans; the back office's access checks
// (app/actions/handson/all/lending/access.ts) ask it before every page and
// action. It replaces reading `session.user.company`, which no auth_sdk
// session carries.

import "server-only";

import { BaseService } from "./base";

export interface LendingLicence {
  licensed: boolean;
  number: string | null;
  company: string | null;
  company_name: string | null;
  country: string | null;
  tax_id: string | null;
  year_end_date: string | null;
}

export interface LendingAccess {
  is_staff: boolean;
  roles: string[];
  has_customer: boolean;
  licence: LendingLicence;
  currency: string | null;
}

export class AccessService {
  /** The answer, or null when signed out or the call failed. */
  static async get(): Promise<LendingAccess | null> {
    try {
      const response = await BaseService.call(
        "api.lending.get_my_lending_access",
      );
      const access = response?.message;
      return access && typeof access === "object" ? (access as LendingAccess) : null;
    } catch {
      return null;
    }
  }
}
