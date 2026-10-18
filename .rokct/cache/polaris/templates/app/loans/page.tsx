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


// /loans: the borrower's home. Their open loan, their applications (drafts
// first, to continue), and the way to apply.

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AccessService } from "@/app/services/all/lending/access";
import { BorrowerService } from "@/app/services/all/lending/borrower";
import { ApplicationStatus } from "@/components/custom/lending/application-status";
import { day, money } from "@/components/custom/lending/borrower-format";

export const dynamic = "force-dynamic";

async function settle<T>(work: Promise<T>, fallback: T): Promise<T> {
  try {
    return (await work) ?? fallback;
  } catch {
    return fallback;
  }
}

export default async function LoansPage() {
  const [access, active, applications] = await Promise.all([
    AccessService.get(),
    settle(BorrowerService.activeLoan(), null),
    settle(BorrowerService.applications(), []),
  ]);
  const currency = access?.currency;
  const drafts = applications.filter((a) => a.status === "Draft");
  const others = applications.filter((a) => a.status !== "Draft");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My loans</h1>
          <p className="text-muted-foreground">Apply, follow your application and manage your loan.</p>
        </div>
        <Button asChild>
          <Link href="/loans/apply">Apply for a loan</Link>
        </Button>
      </div>

      {active && (
        <section className="rounded-lg border border-border p-5">
          <h2 className="text-sm font-medium text-muted-foreground">Your loan</h2>
          <p className="mt-1 text-3xl font-semibold">{money(active.amount_owed, currency)}</p>
          <p className="text-sm text-muted-foreground">
            still owed of {money(active.total_repayable, currency)}, due {day(active.due_date)}
          </p>
        </section>
      )}

      {drafts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Not sent yet</h2>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {drafts.map((a) => (
              <li key={a.name} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{money(a.loan_amount, currency)}</p>
                  <p className="text-sm text-muted-foreground">Started {day(a.modified || a.posting_date)}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/loans/apply?draft=${encodeURIComponent(a.name)}`}>Continue</Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Applications</h2>
        {others.length === 0 ? (
          <p className="text-muted-foreground">You have not sent an application yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {others.map((a) => (
              <li key={a.name}>
                <Link
                  href={`/loans/${encodeURIComponent(a.name)}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{money(a.loan_amount, currency)}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.name} · {day(a.posting_date || a.modified)}
                    </p>
                  </div>
                  <ApplicationStatus status={a.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
