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

"use server";

import { verifyLendingRole } from "@/app/actions/handson/all/lending/access";
import { ProductService } from "@/app/services/all/lending/product";

export async function getLoanProducts() {
  // Note: Returns empty array on failure, handled by UI generic loading/empty state.
  // Ideally refactor to return { data, error } pattern later.
  if (!(await verifyLendingRole())) return [];

  try {
    return await ProductService.getList();
  } catch (e) {
    console.error("Failed to fetch Loan Products", e);
    return [];
  }
}

export async function getLoanProduct(name: string) {
  if (!(await verifyLendingRole())) return null;

  try {
    return await ProductService.get(name);
  } catch (e) {
    return null;
  }
}
