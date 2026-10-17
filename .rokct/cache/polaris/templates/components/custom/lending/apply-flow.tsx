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


// The apply steps of the Polaris web app, mirroring the Dart flow
// (polaris/dart .../application/widgets/step_1..step_6): the borrower's
// money, then who they are, then check-and-send, then documents. Each step
// keeps one draft up to date (save_incomplete_loan_application with
// saved_application_id), so the borrower can stop and continue from
// /loans. A failed affordability check is kept on file the way the Dart app
// keeps it (mark_application_as_rejected).

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkAffordability,
  checkAmount,
  recordDeclined,
  saveDraft,
  submitApplication,
} from "@/app/actions/lending/borrower";

import { DocumentChecklist } from "./document-checklist";
import { money } from "./borrower-format";

interface Details {
  loan_amount?: number;
  monthly_income?: number;
  grocery_expenses?: number;
  other_expenses?: number;
  existing_credits?: number;
  id_number?: string;
  phone?: string;
  saved_application_id?: string;
}

const STEPS = ["Your money", "About you", "Check and send", "Documents"];

function asDetails(d: Details) {
  return {
    loan_amount: Number(d.loan_amount ?? 0),
    monthly_income: Number(d.monthly_income ?? 0),
    grocery_expenses: Number(d.grocery_expenses ?? 0),
    other_expenses: Number(d.other_expenses ?? 0),
    existing_credits: Number(d.existing_credits ?? 0),
    id_number: d.id_number,
    phone: d.phone,
    saved_application_id: d.saved_application_id,
  };
}

export function ApplyFlow({
  initial,
  currency,
  lender,
}: {
  initial: Details;
  currency: string | null;
  lender: string | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<Details>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [declined, setDeclined] = useState<string | null>(null);
  const [application, setApplication] = useState<string | null>(null);
  const [truthful, setTruthful] = useState(false);
  const [consent, setConsent] = useState(false);

  const set = (key: keyof Details) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDetails((d) => ({
      ...d,
      [key]: key === "id_number" || key === "phone" ? raw : raw === "" ? undefined : Number(raw),
    }));
  };

  const keepDraft = async (next: Details) => {
    const saved = await saveDraft(asDetails(next));
    if (saved.ok) {
      setDetails((d) => ({ ...d, saved_application_id: saved.data }));
      return true;
    }
    setError(saved.error);
    return false;
  };

  const leftOver =
    Number(details.monthly_income ?? 0) -
    Number(details.grocery_expenses ?? 0) -
    Number(details.other_expenses ?? 0) -
    Number(details.existing_credits ?? 0);

  const stepOne = async () => {
    setError(null);
    setNote(null);
    if (!details.loan_amount || details.loan_amount <= 0) return setError("Enter the amount you need.");
    if (!details.monthly_income || details.monthly_income <= 0) return setError("Enter your monthly income after tax.");
    setBusy(true);
    const answer = await checkAffordability(asDetails(details));
    if (!answer.ok) {
      setBusy(false);
      return setError(answer.error);
    }
    if (answer.data.status === "ineligible") {
      const reason = answer.data.reason || "We can't offer you a loan right now.";
      await recordDeclined(asDetails(details), reason);
      setBusy(false);
      return setDeclined(reason);
    }
    if (answer.data.status === "pending" && answer.data.reason) setNote(answer.data.reason);
    const saved = await keepDraft(details);
    setBusy(false);
    if (saved) setStep(1);
  };

  const stepTwo = async () => {
    setError(null);
    const id = (details.id_number ?? "").replace(/\s+/g, "");
    if (!/^\d{13}$/.test(id)) return setError("Enter your 13-digit ID number.");
    if (!details.phone || details.phone.replace(/\D/g, "").length < 9) return setError("Enter a phone number we can reach you on.");
    setBusy(true);
    const answer = await checkAmount(asDetails({ ...details, id_number: id }));
    if (!answer.ok) {
      setBusy(false);
      return setError(answer.error);
    }
    if (answer.data.status === "ineligible") {
      setBusy(false);
      return setError(answer.data.reason || "We can't offer this amount.");
    }
    const saved = await keepDraft({ ...details, id_number: id });
    setBusy(false);
    if (saved) setStep(2);
  };

  const stepThree = async () => {
    setError(null);
    if (!truthful || !consent) return setError("Tick both boxes to send your application.");
    setBusy(true);
    const sent = await submitApplication(asDetails(details));
    setBusy(false);
    if (!sent.ok) return setError(sent.error);
    setApplication(sent.data);
    setStep(3);
  };

  if (declined) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">We can't offer a loan right now</h1>
        <p className="text-muted-foreground">{declined}</p>
        <Button asChild variant="outline">
          <Link href="/loans">Back to my loans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Apply for a loan</h1>
        <ol className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={
                "rounded-md border px-3 py-2 " +
                (i === step
                  ? "border-primary font-medium"
                  : i < step
                    ? "border-border text-muted-foreground"
                    : "border-dashed border-border text-muted-foreground")
              }
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>
      </div>

      {note && step < 3 && (
        <p className="rounded-md border border-border bg-muted/40 p-3 text-sm">{note}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {step === 0 && (
        <section className="space-y-4">
          <Field label="How much do you need?" hint={currency ? `In ${currency}` : undefined}>
            <Input type="number" inputMode="decimal" min={0} value={details.loan_amount ?? ""} onChange={set("loan_amount")} />
          </Field>
          <Field label="Monthly income after tax">
            <Input type="number" inputMode="decimal" min={0} value={details.monthly_income ?? ""} onChange={set("monthly_income")} />
          </Field>
          <Field label="Groceries each month">
            <Input type="number" inputMode="decimal" min={0} value={details.grocery_expenses ?? ""} onChange={set("grocery_expenses")} />
          </Field>
          <Field label="Other expenses each month" hint="Rent, transport, school fees and the like.">
            <Input type="number" inputMode="decimal" min={0} value={details.other_expenses ?? ""} onChange={set("other_expenses")} />
          </Field>
          <Field label="Repayments on other credit each month" hint="Store cards, other loans, credit cards.">
            <Input type="number" inputMode="decimal" min={0} value={details.existing_credits ?? ""} onChange={set("existing_credits")} />
          </Field>
          {details.monthly_income ? (
            <p className="text-sm text-muted-foreground">Left over each month: {money(leftOver, currency)}</p>
          ) : null}
          <Button onClick={stepOne} disabled={busy}>{busy ? "Checking…" : "Next"}</Button>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <Field label="ID number">
            <Input inputMode="numeric" autoComplete="off" value={details.id_number ?? ""} onChange={set("id_number")} />
          </Field>
          <Field label="Phone number">
            <Input type="tel" autoComplete="tel" value={details.phone ?? ""} onChange={set("phone")} />
          </Field>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)} disabled={busy}>Back</Button>
            <Button onClick={stepTwo} disabled={busy}>{busy ? "Checking…" : "Next"}</Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <dl className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
            <Fact term="Amount" value={money(details.loan_amount, currency)} />
            <Fact term="Monthly income" value={money(details.monthly_income, currency)} />
            <Fact
              term="Monthly expenses and repayments"
              value={money(
                Number(details.grocery_expenses ?? 0) + Number(details.other_expenses ?? 0) + Number(details.existing_credits ?? 0),
                currency,
              )}
            />
            <Fact term="ID number" value={details.id_number ?? ""} />
          </dl>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" checked={truthful} onChange={(e) => setTruthful(e.target.checked)} />
            <span>The figures I gave are true and complete.</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              I agree that {lender || "the lender"} may check my credit record and read the bank statements I upload to
              decide on this application.
            </span>
          </label>
          <p className="text-sm text-muted-foreground">
            After you send it, upload your ID and your latest bank statement as the PDF from your bank.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} disabled={busy}>Back</Button>
            <Button onClick={stepThree} disabled={busy}>{busy ? "Sending…" : "Send application"}</Button>
          </div>
        </section>
      )}

      {step === 3 && application && (
        <section className="space-y-4">
          <p>
            Your application <span className="font-medium">{application}</span> is with us. Upload your documents now so we
            can decide.
          </p>
          <DocumentChecklist loanApplication={application} uploadedFileNames={[]} onChange={() => undefined} />
          <Button onClick={() => router.push(`/loans/${encodeURIComponent(application)}`)}>Done</Button>
        </section>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{term}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
