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


// /loans/[id]: one of the borrower's applications. Where it stands, the
// contract to accept or decline once approved, the payout request once paid
// out, the documents, and cancelling while nobody has decided yet. The
// backend answers "not found" for anyone else's application.

import Link from "next/link";
import { notFound } from "next/navigation";

import { AccessService } from "@/app/services/all/lending/access";
import {
  BorrowerService,
  type BorrowerApplication,
  type LoanContract,
} from "@/app/services/all/lending/borrower";
import { ApplicationStatus } from "@/components/custom/lending/application-status";
import { day, money, statusWords } from "@/components/custom/lending/borrower-format";
import { DocumentChecklist } from "@/components/custom/lending/document-checklist";
import { LoanActions } from "@/components/custom/lending/loan-actions";

export const dynamic = "force-dynamic";

export default async function LoanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const name = decodeURIComponent(id);

  let application: BorrowerApplication | null = null;
  try {
    application = await BorrowerService.details(name);
  } catch {
    notFound();
  }
  if (!application) notFound();

  const status = application.status;
  const hasContract = status === "Approved" || status === "Disbursed";
  const [access, documents, contract] = await Promise.all([
    AccessService.get(),
    BorrowerService.documents(name).catch(() => []),
    hasContract
      ? BorrowerService.contract(name).catch(() => null as LoanContract | null)
      : Promise.resolve(null as LoanContract | null),
  ]);
  const currency = application.currency || access?.currency;
  const answered = application.contract_status === "Accepted" || application.contract_status === "Declined";

  const actions: ("accept" | "decline" | "payout" | "cancel")[] = [];
  if (status === "Approved" && !answered) actions.push("accept", "decline");
  if (status === "Disbursed" && !application.payout_requested_on) actions.push("payout");
  if (status === "Draft" || status === "Submitted") actions.push("cancel");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/loans" className="text-sm text-muted-foreground hover:text-foreground">
          {"←"} My loans
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{money(application.loan_amount, currency)}</h1>
          <ApplicationStatus status={status} />
        </div>
        <p className="text-muted-foreground">{statusWords(status).line}</p>
      </div>

      <dl className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4 sm:grid-cols-3">
        <Fact term="Application" value={application.name} />
        <Fact term="Sent" value={day(application.posting_date)} />
        <Fact term="Loan" value={application.loan_product || "—"} />
        {application.contract_status && <Fact term="Your answer" value={application.contract_status} />}
        {application.contract_responded_on && <Fact term="Answered on" value={day(application.contract_responded_on)} />}
        {application.payout_requested_on && <Fact term="Payout requested" value={day(application.payout_requested_on)} />}
      </dl>

      {contract && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{contract.title || "Loan contract"}</h2>
          <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 font-sans text-sm">
            {contract.content}
          </pre>
        </section>
      )}

      <LoanActions loanApplication={application.name} actions={actions} />

      {status !== "Cancelled" && status !== "Rejected" && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Documents</h2>
          <DocumentChecklist
            loanApplication={application.name}
            uploadedFileNames={(documents ?? []).map((d) => d.file_name)}
          />
        </section>
      )}
    </div>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{term}</dt>
      <dd className="font-medium break-words">{value}</dd>
    </div>
  );
}
