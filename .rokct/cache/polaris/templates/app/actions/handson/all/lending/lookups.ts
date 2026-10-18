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


// The two pick lists the new-application page needs, read by the lending
// SDK itself instead of borrowing erp_sdk's accounting and HR actions
// (getCustomers from accounting/selling/sales_order.ts, getCompanies from
// hrms/companies.ts), which a Polaris shell does not compose.

"use server";

import { verifyLendingRole } from "@/app/actions/handson/all/lending/access";
import { BaseService } from "@/app/services/all/lending/base";

export async function getCustomers() {
  if (!(await verifyLendingRole())) return [];
  try {
    return await BaseService.getList("Customer", {
      fields: ["name", "customer_name"],
      order_by: "customer_name asc",
      limit_page_length: 500,
    });
  } catch {
    return [];
  }
}

export async function getCompanies() {
  if (!(await verifyLendingRole())) return [];
  try {
    return await BaseService.getList("Company", {
      fields: ["name", "company_name"],
      order_by: "company_name asc",
      limit_page_length: 100,
    });
  } catch {
    return [];
  }
}
