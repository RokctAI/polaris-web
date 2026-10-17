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

"use client";

import React, { use, useEffect, useState } from "react";
import {
  getLoanApplication,
  getApplicationDocuments,
  uploadApplicationDocument,
} from "@/app/actions/handson/all/lending/application";
import {
  addStatementText,
  createQuoteLink,
  getApplicationStatements,
  getLoanQuote,
  reparseStatements,
  runDecisionEngine,
  setIncomeOverride,
} from "@/app/actions/handson/all/lending/decision_engine";
import { shareLoanQuote } from "@/app/templates/lending/loanQuoteImage";
import {
  shareDecisionNotice,
  type DecisionNotice,
} from "@/app/templates/lending/decisionNoticeImage";
import {
  RiFileUploadLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiCloseLine,
  RiLoader4Line,
  RiPrinterLine,
  RiSmartphoneLine,
  RiMailLine,
  RiFileTextLine,
  RiShareLine,
} from "@remixicon/react";
import Link from "next/link";
import { toast } from "sonner";
import { getSessionCurrency } from "@/app/actions/handson/all/lending/currency";
import t from "@/app/lib/i18n";

export default function LoanApplicationDetails({
  params: routeParams,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+ hands a page its route params as a Promise.
  const params = use(routeParams);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("ZAR");
  const [notice, setNotice] = useState<DecisionNotice | null>(null);
  // Staff only: typed income against what the statements show.
  const [incomeCheck, setIncomeCheck] = useState<IncomeCheck | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  // Staff only: the stored bank statements (one per file).
  const [statements, setStatements] = useState<StatementSummary[]>([]);

  const fetchStatements = async () => {
    const res = await getApplicationStatements(params.id);
    if (res.success) setStatements(res.data || []);
  };

  const runEngine = async () => {
    const toastId = toast.loading("Running Decision Engine...");
    const res = await runDecisionEngine(params.id);
    if (res.success) {
      toast.success(
        `${res.data.decision}: ${res.data.score ?? "—"} (${res.data.risk_level})`,
        { id: toastId },
      );
      setNotice(res.data.notice ?? null);
      setIncomeCheck(res.data.income_check ?? null);
      // The engine reads any statement file that was not stored yet.
      fetchStatements();
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  // Staff override one statement line, then re-run so the decision uses it.
  const overrideLine = async (
    key: string,
    action: "income" | "not_income" | "clear",
    reason: string,
  ) => {
    const res = await setIncomeOverride(params.id, key, action, reason);
    if (!res.success) {
      toast.error(res.error || "Could not save the change");
      return;
    }
    await runEngine();
  };

  const reread = async () => {
    const toastId = toast.loading("Reading the statements again...");
    const res = await reparseStatements(params.id);
    if (res.success) {
      setStatements(res.data || []);
      toast.success("Statements read again", { id: toastId });
    } else {
      toast.error(res.error || "Could not read the statements", { id: toastId });
    }
  };

  const pasteStatement = async (text: string, fileName: string) => {
    const res = await addStatementText(params.id, text, fileName || undefined);
    if (!res.success) {
      toast.error(res.error || "Could not save the statement text");
      return false;
    }
    toast.success("Statement text saved");
    await fetchStatements();
    return true;
  };

  const fetchDocuments = async () => {
    const res = await getApplicationDocuments(params.id);
    setDocuments(res.data || []);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  useEffect(() => {
    getLoanApplication(params.id).then((res) => {
      setData(res.data);
      setLoading(false);
    });
    getSessionCurrency().then((c) => setCurrency(c));
    fetchDocuments();
    fetchStatements();
  }, [params.id]);

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <RiLoader4Line className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  if (!data)
    return (
      <div className="p-12 text-center text-red-500">Application not found</div>
    );

  const sections = [
    {
      title: t('app.lending.applicant_details'),
      items: [
        { label: t('app.lending.applicant'), value: data.applicant },
        { label: t('common.type'), value: data.applicant_type },
      ],
    },
    {
      title: t('app.lending.loan_details'),
      items: [
        { label: t('app.lending.loan_product'), value: data.loan_product },
        { label: t('common.amount'), value: formatCurrency(data.loan_amount) },
        {
          label: t('common.status'),
          value: (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
              {data.status}
            </span>
          ),
        },
      ],
    },
    {
      // What the client did with the contract the app shows them after
      // approval (api.lending.accept_loan_contract / decline_loan_contract),
      // and whether they asked for the payout (api.lending.request_payout).
      title: "Contract",
      items: [
        {
          label: "Client's answer",
          value: <ContractBadge status={data.contract_status} applicationStatus={data.status} />,
        },
        { label: "Answered on", value: whenText(data.contract_responded_on) },
        { label: "Payout requested", value: whenText(data.payout_requested_on) },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
           <p className="text-gray-500">
             {t('app.lending.application_details_desc')}
           </p>
        </div>
        <div className="flex space-x-3">
             <Link
               href={`/portal/quote/${params.id}`}
               target="_blank"
               className="flex items-center px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 font-medium transition-colors"
             >
               <RiSmartphoneLine className="w-4 h-4 mr-2" />
               {t('app.lending.client_portal')}
             </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {section.title}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {section.items.map((item, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      {item.label}
                    </p>
                    <div className="text-gray-900 font-medium">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Supporting Documents Section */}
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-4">
               {t('app.lending.supporting_docs')}
             </h3>
             <div className="space-y-3">
               <DocumentRow applicationId={params.id} documentType="id_front" documents={documents} onUploaded={fetchDocuments} label={t('app.lending.id_document')} required />
               <DocumentRow applicationId={params.id} documentType="proof_of_address" documents={documents} onUploaded={fetchDocuments} label={t('app.lending.proof_address')} required />
               <DocumentRow applicationId={params.id} documentType="bank_statement" documents={documents} onUploaded={fetchDocuments} label={t('app.lending.bank_statement')} required />
               <DocumentRow applicationId={params.id} documentType="payslip" documents={documents} onUploaded={fetchDocuments} label={t('app.lending.payslip')} />
             </div>
           </div>

          {/* Debt Enforcement / Collections Workflow */}
          <div className="space-y-6">
             <div className="bg-red-50 border border-red-100 rounded-xl p-6">
               <div className="flex items-center space-x-2 text-red-800 mb-4">
                 <RiErrorWarningLine className="w-5 h-5" />
                 <h3 className="font-bold">{t('app.lending.debt_enforcement')}</h3>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1: Call */}
                 <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                   <h4 className="text-sm font-semibold text-gray-900 mb-2">
                     {t('app.lending.debt_step_1')}
                   </h4>
                   <p className="text-xs text-gray-500 mb-3">
                     {t('app.lending.debt_step_1_desc')}
                   </p>
                   <button
                     onClick={() => {
                       const note = prompt("Enter call outcome:");
                       if (note)
                         toast.success("Call logged", { description: note });
                     }}
                     className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center"
                   >
                     <span className="mr-2">📞</span> {t('app.lending.log_call')}
                   </button>
                 </div>

                {/* Step 2: Auto-Send S129 */}
                 <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                   <h4 className="text-sm font-semibold text-gray-900 mb-2">
                     {t('app.lending.debt_step_2')}
                   </h4>
                   <p className="text-xs text-gray-500 mb-3">
                     {t('app.lending.debt_step_2_desc')}
                   </p>
                   <div className="flex items-center text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                     <RiMailLine className="w-4 h-4 mr-2" />
                     {t('app.lending.debt_step_2_auto')}
                   </div>
                 </div>
              </div>
            </div>

            {/* Standard Actions */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center">
               <Link
                 href={`/handson/all/lending/reports/form-20/${params.id}`}
                 className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 font-medium transition-colors"
               >
                 <RiPrinterLine className="w-4 h-4 mr-2" />
                 {t('app.lending.form_20_quote')}
               </Link>

                 <button
                   onClick={async () => {
                     const res = await getLoanQuote(params.id);
                     if (!res.success || !res.data) {
                       toast.error(res.error || "Could not load the quote");
                       return;
                     }
                     // The acceptance link is for clients without the app.
                     const link = await createQuoteLink(params.id);
                     const acceptUrl = link.success && link.data?.token
                       ? `${window.location.origin}/portal/loan-quote/${link.data.token}`
                       : undefined;
                     if (!acceptUrl)
                       toast.error("Quote shared without an acceptance link");
                     try {
                       const how = await shareLoanQuote(
                         res.data,
                         `quote-${params.id}`,
                         acceptUrl,
                       );
                       if (how === "downloaded")
                         toast.success(
                           acceptUrl
                             ? "Quote saved as an image; acceptance link copied"
                             : "Quote saved as an image",
                         );
                     } catch (e: any) {
                       if (e?.name !== "AbortError")
                         toast.error("Could not create the quote image");
                     }
                   }}
                   className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                 >
                   <RiShareLine className="w-4 h-4 mr-2" />
                   Share quote
                 </button>

                 <button
                   onClick={runEngine}
                   className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-sm"
                 >
                   <RiSmartphoneLine className="w-4 h-4 mr-2" />
                   {t('app.lending.decision_engine')}
                 </button>

                 {notice && (
                   <button
                     onClick={async () => {
                       try {
                         const how = await shareDecisionNotice(
                           notice,
                           `decision-${params.id}`,
                         );
                         if (how === "downloaded")
                           toast.success("Decision notice saved as an image");
                       } catch (e: any) {
                         if (e?.name !== "AbortError")
                           toast.error("Could not create the notice image");
                       }
                     }}
                     className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                   >
                     <RiShareLine className="w-4 h-4 mr-2" />
                     Share decision notice
                   </button>
                 )}

               <div className="space-x-3">
                 <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                   {t('common.reject')}
                 </button>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">
                   {t('common.approve')}
                 </button>
               </div>
            </div>
            {incomeCheck && (
              <IncomeCheckPanel
                check={incomeCheck}
                formatCurrency={formatCurrency}
                onOverride={overrideLine}
              />
            )}
            {(statements.length > 0 || documents.length > 0) && (
              <StatementsPanel
                statements={statements}
                onReread={reread}
                onPaste={pasteStatement}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface IncomeCheck {
  declared: number | null;
  from_statements: number;
  used: number;
  declared_above_statements_pct: number | null;
  gap_warning: boolean;
  months: Record<string, number>;
  once_off: { date: string; amount: number; counterparty: string }[];
  credits: IncomeCredit[];
  overrides: {
    key: string;
    action: "income" | "not_income" | "clear";
    reason: string;
    by: string;
    on: string;
  }[];
}

interface IncomeCredit {
  key: string;
  date: string;
  amount: number;
  counterparty: string;
  description: string;
  counted: boolean;
  reason: string | null;
  overridden: boolean;
}

// Why the engine left a credit out (decision_engine/statements/income.py).
const CREDIT_REASONS: Record<string, string> = {
  own_transfer: "own transfer",
  not_income: "loan, refund or reversal",
  paid_back: "money back from someone they paid",
  lender: "lender",
  family: "same surname",
  company_account: "company account, not personal income",
  once_off: "once-off",
  staff: "changed by staff",
};

// What the engine used for affordability: the lower of the typed income and
// the statements' income. The gap is for staff to judge honesty; it is never
// counted against the applicant or shown in the decision notice.
function IncomeCheckPanel({
  check,
  formatCurrency,
  onOverride,
}: {
  check: IncomeCheck;
  formatCurrency: (amount: number) => string;
  onOverride: (
    key: string,
    action: "income" | "not_income" | "clear",
    reason: string,
  ) => Promise<void>;
}) {
  const credits = check.credits ?? [];
  const log = check.overrides ?? [];
  const gap = check.declared_above_statements_pct;
  // The line staff are changing, and why: the reason is required and kept.
  const [asking, setAsking] = useState<{
    key: string;
    action: "income" | "not_income" | "clear";
  } | null>(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const question =
    asking?.action === "income"
      ? "Why should this count as income?"
      : asking?.action === "not_income"
        ? "Why is this not income?"
        : "Why undo this change?";
  const submit = async () => {
    if (!asking || !reason.trim()) return;
    setSaving(true);
    await onOverride(asking.key, asking.action, reason.trim());
    setSaving(false);
    setAsking(null);
    setReason("");
  };
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
      <p className="font-medium text-gray-900">Income check (staff only)</p>
      <p className="mt-1">
        Typed: {check.declared != null ? formatCurrency(check.declared) : "not filled in"} ·
        Statements: {formatCurrency(check.from_statements)} a month · Used:{" "}
        {formatCurrency(check.used)}
      </p>
      {check.gap_warning ? (
        <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-medium text-red-700">
          Warning:{" "}
          {gap != null
            ? `typed income is ${gap}% above what the statements show.`
            : "income was typed but the statements show none."}{" "}
          Check it with the client. The lower figure was used.
        </p>
      ) : (
        gap != null &&
        gap > 0 && (
          <p className="mt-1 text-amber-700">
            Typed income is {gap}% above what the statements show.
          </p>
        )
      )}
      <p className="mt-1 text-gray-500">
        {Object.entries(check.months)
          .map(([month, amount]) => `${month}: ${formatCurrency(amount)}`)
          .join(" · ")}
      </p>
      {check.once_off.length > 0 && (
        <p className="mt-1 text-gray-500">
          Left out as once-off:{" "}
          {check.once_off
            .map((o) => `${formatCurrency(o.amount)} on ${o.date}`)
            .join(", ")}
        </p>
      )}
      {credits.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer font-medium text-gray-900">
            Statement lines ({credits.filter((c) => !c.counted).length} left
            out, {credits.filter((c) => c.counted).length} large ones counted)
          </summary>
          <table className="mt-2 w-full text-left text-xs">
            <tbody>
              {credits.map((c) => (
                <React.Fragment key={c.key}>
                  <tr className="border-t border-gray-200">
                    <td className="py-1 pr-2 whitespace-nowrap">{c.date}</td>
                    <td className="py-1 pr-2">{c.description}</td>
                    <td className="py-1 pr-2 whitespace-nowrap">
                      {formatCurrency(c.amount)}
                    </td>
                    <td className="py-1 pr-2 text-gray-500">
                      {c.counted
                        ? c.overridden
                          ? "counted (changed by staff)"
                          : "counted"
                        : `left out: ${CREDIT_REASONS[c.reason ?? ""] ?? c.reason}`}
                    </td>
                    <td className="py-1 whitespace-nowrap text-right">
                      {c.overridden ? (
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => setAsking({ key: c.key, action: "clear" })}
                        >
                          Undo
                        </button>
                      ) : (
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() =>
                            setAsking({
                              key: c.key,
                              action: c.counted ? "not_income" : "income",
                            })
                          }
                        >
                          {c.counted ? "Not income" : "Count as income"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {asking?.key === c.key && (
                    <tr className="bg-white">
                      <td colSpan={5} className="py-2 pr-2">
                        <form
                          className="flex flex-wrap items-center gap-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            submit();
                          }}
                        >
                          <label className="text-gray-700">{question}</label>
                          <input
                            autoFocus
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason (kept with your name)"
                            className="flex-1 min-w-[12rem] rounded-md border border-gray-300 px-2 py-1 text-xs"
                          />
                          <button
                            type="submit"
                            disabled={saving || !reason.trim()}
                            className="rounded-md bg-blue-600 px-3 py-1 text-white disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAsking(null);
                              setReason("");
                            }}
                            className="text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </details>
      )}
      {log.length > 0 && (
        <div className="mt-3">
          <p className="font-medium text-gray-900">Changes by staff</p>
          <ul className="mt-1 space-y-1 text-xs text-gray-600">
            {log.map((o, i) => (
              <li key={i}>
                {o.on} · {o.by} ·{" "}
                {o.action === "income"
                  ? "counted as income"
                  : o.action === "not_income"
                    ? "left out"
                    : "undone"}{" "}
                · {o.key.split("|").slice(0, 2).join(" ")} · “{o.reason}”
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// One stored bank statement (api/statements.py get_application_statements).
interface StatementSummary {
  name: string;
  file: string | null;
  file_name: string | null;
  source: "pdf" | "ocr" | "text";
  bank: string | null;
  account_holder: string | null;
  is_company_account: boolean;
  holder_match: "yes" | "no" | "unknown" | "company" | null;
  period_from: string | null;
  period_to: string | null;
  rows: number;
  mismatches: number | null;
  reconciled: boolean;
  balance_checked: boolean;
  unreadable: boolean;
  authenticity_verdict: "consistent" | "suspicious" | "unverified" | null;
  authenticity_issuer: string | null;
  authenticity_signals: string[];
  parse_error: string | null;
  lines: number;
}

// A Frappe datetime ("2026-10-17 18:00:00.123") to the minute, or a dash.
function whenText(value?: string | null): string {
  return value ? String(value).slice(0, 16) : "\u2014";
}

// The contract is only offered once an application is Approved; before that
// there is nothing for the client to answer.
function ContractBadge({
  status,
  applicationStatus,
}: {
  status?: string | null;
  applicationStatus?: string;
}) {
  const [text, tone] =
    status === "Accepted"
      ? ["Accepted", "bg-green-100 text-green-700"]
      : status === "Declined"
        ? ["Declined", "bg-red-100 text-red-700"]
        : applicationStatus === "Approved"
          ? ["Waiting for the client", "bg-amber-100 text-amber-700"]
          : ["Not offered yet", "bg-gray-100 text-gray-600"];
  return <span className={`px-2 py-1 rounded-full text-xs font-bold ${tone}`}>{text}</span>;
}

const SOURCE_LABELS: Record<string, string> = {
  pdf: "PDF",
  ocr: "scan (OCR)",
  text: "pasted text",
};

// What happened to a statement, in one short phrase for staff.
function statementState(s: StatementSummary): { text: string; tone: string } {
  if (s.parse_error === "ocr_pending")
    return { text: "waiting for the scan to be read", tone: "text-amber-700" };
  if (s.parse_error === "ocr_unavailable")
    return {
      text: "scan: no reader on this site, ask for the bank's PDF",
      tone: "text-red-700",
    };
  if (s.parse_error?.startsWith("ocr_failed"))
    return { text: "scan could not be read", tone: "text-red-700" };
  if (s.unreadable) return { text: "no transactions could be read", tone: "text-red-700" };
  if (!s.reconciled)
    return {
      text: `${s.mismatches ?? "some"} rows did not reconcile, not used`,
      tone: "text-red-700",
    };
  if (!s.balance_checked)
    return { text: `${s.lines} lines, no balance column to check against`, tone: "text-amber-700" };
  return { text: `${s.lines} lines, every row reconciled`, tone: "text-green-700" };
}

function holderNote(s: StatementSummary): { text: string; tone: string } | null {
  if (s.holder_match === "company") return { text: "company account", tone: "text-gray-600" };
  if (s.holder_match === "no") return { text: "not the applicant's name", tone: "text-red-700" };
  if (s.holder_match === "unknown" && !s.account_holder)
    return { text: "holder not printed", tone: "text-gray-500" };
  return null;
}

// Staff only: which statements the decision stands on and what each one
// said about itself. A verdict is a signal, never proof.
function StatementsPanel({
  statements,
  onReread,
  onPaste,
}: {
  statements: StatementSummary[];
  onReread: () => Promise<void>;
  onPaste: (text: string, fileName: string) => Promise<boolean>;
}) {
  const [pasting, setPasting] = useState(false);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-gray-900">
          Bank statements (staff only){statements.length ? ` · ${statements.length}` : ""}
        </p>
        <div className="space-x-3 text-xs">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setPasting((v) => !v)}
          >
            Paste statement text
          </button>
          <button
            className="text-blue-600 hover:underline"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onReread();
              setBusy(false);
            }}
          >
            Re-read statements
          </button>
        </div>
      </div>
      {statements.length === 0 && (
        <p className="mt-1 text-gray-500">
          No statement has been read yet. Upload one as a bank statement, or run the
          Decision Engine to read the attached PDFs.
        </p>
      )}
      {statements.length > 0 && (
        <table className="mt-2 w-full text-left text-xs">
          <thead className="text-gray-500">
            <tr>
              <th className="py-1 pr-2 font-normal">File</th>
              <th className="py-1 pr-2 font-normal">Bank / holder</th>
              <th className="py-1 pr-2 font-normal">Period</th>
              <th className="py-1 pr-2 font-normal">Read</th>
              <th className="py-1 font-normal">File check</th>
            </tr>
          </thead>
          <tbody>
            {statements.map((s) => {
              const state = statementState(s);
              const holder = holderNote(s);
              return (
                <tr key={s.name} className="border-t border-gray-200 align-top">
                  <td className="py-1 pr-2">
                    {s.file_name ?? "—"}
                    <span className="block text-gray-500">{SOURCE_LABELS[s.source] ?? s.source}</span>
                  </td>
                  <td className="py-1 pr-2">
                    {s.bank ?? "bank not named"}
                    <span className="block">{s.account_holder ?? "—"}</span>
                    {holder && <span className={`block ${holder.tone}`}>{holder.text}</span>}
                  </td>
                  <td className="py-1 pr-2 whitespace-nowrap">
                    {s.period_from && s.period_to ? `${s.period_from} → ${s.period_to}` : "—"}
                  </td>
                  <td className={`py-1 pr-2 ${state.tone}`}>{state.text}</td>
                  <td className="py-1">
                    {s.authenticity_verdict === "consistent" && (
                      <span className="text-green-700">looks genuine ({s.authenticity_issuer})</span>
                    )}
                    {s.authenticity_verdict === "suspicious" && (
                      <span className="text-red-700">
                        signs of editing: {s.authenticity_signals.join(", ")}
                      </span>
                    )}
                    {s.authenticity_verdict === "unverified" && (
                      <span className="text-amber-700">
                        {s.source === "pdf" ? "unknown generator, not checked" : "no file to check"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {pasting && (
        <form
          className="mt-3 space-y-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!text.trim()) return;
            setBusy(true);
            const ok = await onPaste(text, fileName);
            setBusy(false);
            if (ok) {
              setText("");
              setFileName("");
              setPasting(false);
            }
          }}
        >
          <p className="text-gray-600">
            For a statement that could not be read from its file: paste the text as the
            bank's app or PDF shows it (date, description, amounts, balance per line). It
            is stored as pasted text, never counts as a checked file, and keeps the
            application on a staff hold.
          </p>
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Which statement (e.g. Capitec, August)"
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-gray-300 px-2 py-1 font-mono text-xs"
          />
          <div className="space-x-3 text-xs">
            <button
              type="submit"
              disabled={busy || !text.trim()}
              className="rounded-md bg-blue-600 px-3 py-1 text-white disabled:opacity-50"
            >
              Save statement text
            </button>
            <button
              type="button"
              className="text-gray-600 hover:underline"
              onClick={() => setPasting(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Stored file names start with the type label the backend gives them
// (api/documents.py DOCUMENT_TYPES), e.g. "Bank statement - march.pdf".
const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  id_front: "ID front",
  id_back: "ID back",
  bank_statement: "Bank statement",
  payslip: "Payslip",
  proof_of_address: "Proof of address",
  selfie: "Selfie",
};

function DocumentRow({
  label,
  required = false,
  applicationId,
  documentType,
  documents,
  onUploaded,
}: {
  label: string;
  required?: boolean;
  applicationId: string;
  documentType: string;
  documents: any[];
  onUploaded: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const prefix = `${DOCUMENT_TYPE_LABELS[documentType]} - `;
  const uploaded = documents.filter((d) =>
    (d.file_name || "").startsWith(prefix),
  );
  const status: "missing" | "uploading" | "uploaded" = uploading
    ? "uploading"
    : uploaded.length
      ? "uploaded"
      : "missing";

  const handleUpload = () => inputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await uploadApplicationDocument(applicationId, documentType, form);
    setUploading(false);
    if (res.success) {
      toast.success(`${label} uploaded`);
      onUploaded();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group">
      <div className="flex items-center space-x-4">
        <div
          className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${status === "uploaded" ? "bg-green-100 text-green-600" : "bg-white border border-gray-200 text-gray-400"}
                `}
        >
          {status === "uploaded" ? (
            <RiCheckboxCircleLine className="w-5 h-5" />
          ) : (
            <RiFileTextLine className="w-5 h-5" />
          )}
        </div>
        <div>
             <div className="flex items-center space-x-2">
               <span className="font-medium text-gray-900">{label}</span>
               {required && (
                 <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                   {t('common.required')}
                 </span>
               )}
             </div>
           <p className="text-xs text-gray-500">
             {status === "uploaded"
               ? t('common.uploaded_success')
               : t('common.upload_prompt')}
           </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={documentType === "bank_statement" ? ".pdf,application/pdf" : ".pdf,image/*"}
        onChange={handleFile}
        hidden
      />
      {status === "uploaded" ? (
        <button
          onClick={handleUpload}
          title={t('common.upload')}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RiFileUploadLine className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={handleUpload}
          disabled={status === "uploading"}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
        >
           {status === "uploading" ? (
             <RiLoader4Line className="w-4 h-4 mr-2 animate-spin" />
           ) : (
             <RiFileUploadLine className="w-4 h-4 mr-2" />
           )}
           {status === "uploading" ? t('common.uploading') : t('common.upload')}
        </button>
      )}
    </div>
  );
}
