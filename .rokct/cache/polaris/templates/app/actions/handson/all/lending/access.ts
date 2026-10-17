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


// The back office's access checks, answered by the backend
// (`api.lending.get_my_lending_access` via AccessService) instead of the
// RokctAI_frontend host's app/lib/roles.ts, which read a company licence
// from `session.user.company` that no auth_sdk session carries and which a
// fresh shell does not have. Same names and answers as the host's helpers,
// so the pages only changed their import. The backend still checks
// STAFF_ROLES on every lending cmd; these only decide what a page shows.

"use server";

import { AccessService, type LendingAccess } from "@/app/services/all/lending/access";

/** The full answer for the signed-in user, or null. */
export async function getMyLendingAccess(): Promise<LendingAccess | null> {
  return AccessService.get();
}

/** The default Company holds a credit provider licence number. */
export async function verifyLendingLicense() {
  const access = await AccessService.get();
  return !!access?.licence?.licensed;
}

/** Lending staff (System Manager or Loan Manager) at a licensed company. */
export async function verifyLendingRole() {
  const access = await AccessService.get();
  return !!access?.is_staff && !!access.licence?.licensed;
}

/**
 * The licence facts the reports and the layout banner read. The NCR annual
 * returns are due six months after the financial year end; the banner warns
 * from 60 days out.
 */
export async function getLendingLicenseDetails() {
  const access = await AccessService.get();
  const licence = access?.licence;
  if (!licence) {
    return { isLicensed: false, country: null, error: "No lending access" };
  }

  const compliance = {
    deadline: null as Date | null,
    daysRemaining: null as number | null,
    isDueSoon: false,
    isOverdue: false,
  };
  if (licence.year_end_date) {
    const deadline = new Date(licence.year_end_date);
    deadline.setMonth(deadline.getMonth() + 6);
    const daysRemaining = Math.ceil(
      (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    compliance.deadline = deadline;
    compliance.daysRemaining = daysRemaining;
    compliance.isDueSoon = daysRemaining > 0 && daysRemaining <= 60;
    compliance.isOverdue = daysRemaining < 0;
  }

  return {
    isLicensed: licence.licensed,
    country: licence.country || "South Africa",
    licenseNumber: licence.number,
    financialYearEnd: licence.year_end_date,
    companyName: licence.company_name || licence.company,
    compliance,
    taxId: licence.tax_id,
  };
}
