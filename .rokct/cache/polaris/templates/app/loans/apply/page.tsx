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


// /loans/apply: the Dart application steps in a browser (polaris/docs/
// web-app.md section 4). `?draft=<name>` continues one of the borrower's
// own drafts; anything else starts fresh.

import { BorrowerService, type ApplicationDetails } from "@/app/services/all/lending/borrower";
import { AccessService } from "@/app/services/all/lending/access";
import { ApplyFlow } from "@/components/custom/lending/apply-flow";

export const dynamic = "force-dynamic";

async function draftDetails(name: string | undefined): Promise<Partial<ApplicationDetails>> {
  if (!name) return {};
  try {
    const draft = await BorrowerService.details(name);
    if (!draft || draft.status !== "Draft") return {};
    return {
      saved_application_id: draft.name,
      loan_amount: Number(draft.loan_amount ?? 0) || undefined,
      monthly_income: Number(draft.monthly_income ?? 0) || undefined,
      // A draft keeps one expenses total; it comes back as "other".
      other_expenses: Number(draft.monthly_expenses ?? 0) || undefined,
    } as Partial<ApplicationDetails>;
  } catch {
    return {};
  }
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const { draft } = await searchParams;
  const [initial, access] = await Promise.all([draftDetails(draft), AccessService.get()]);
  return (
    <ApplyFlow
      initial={initial}
      currency={access?.currency ?? null}
      lender={access?.licence?.company_name ?? null}
    />
  );
}
