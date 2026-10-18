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


// The loan calculator on the Polaris landing: an amount, a term, cover on
// or off, and what that loan can cost at most under the National Credit
// Act - worked by the SDK's NCR engine through polaris-loan-presets.ts. The
// left column is the borrower's side (the amount as a figure they can type
// or slide, the months as a row of buttons, the cover as a switch); the
// right is the answer (the total, the instalment, every line of the cost,
// and the s103(5) bar: cost of credit against the amount, the ceiling the
// Act sets). The figures ease between values; a visitor who prefers
// reduced motion sees them jump.
//
// A client module: it holds the inputs. It is drawn by the hero form, so
// it sits where the frame puts the form - under the headline.

"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";

import {
  clampAmount,
  estimateAtLegalMaximum,
  formatRand,
  groupThousands,
  MONTH_OPTIONS,
  SHORT_TERM_LOAN,
} from "./polaris-loan-presets";

const EASE_MS = 420;

/** `target`, eased from the last value over EASE_MS; the target itself under reduced motion. */
function useEasedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const shown = useRef(target);
  useEffect(() => {
    const from = shown.current;
    const delta = target - from;
    if (delta === 0) return;
    const still =
      typeof window === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      shown.current = target;
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / EASE_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + delta * eased;
      shown.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return value;
}

function CostRow({
  label,
  note,
  value,
  strong = false,
}: {
  label: string;
  note?: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="px-row">
      <dt className={strong ? "font-semibold text-[var(--px-ink)]" : "text-[var(--px-ink-2)]"}>
        {label}
        {note && <span className="ml-1.5 text-xs text-[var(--px-ink-3)]">{note}</span>}
      </dt>
      <dd
        className={`px-num ${strong ? "text-lg text-[var(--px-ink)]" : "text-[var(--px-ink)]"}`}
      >
        {formatRand(value, { cents: true })}
      </dd>
    </div>
  );
}

export function PolarisLoanCalculator({
  signupUrl,
  id,
}: {
  signupUrl: string;
  id?: string;
}) {
  const [amount, setAmount] = useState<number>(SHORT_TERM_LOAN.defaultAmount);
  const [typed, setTyped] = useState<string | null>(null);
  const [months, setMonths] = useState<number>(SHORT_TERM_LOAN.defaultMonths);
  const [cover, setCover] = useState(false);
  const amountId = useId();

  const estimate = useMemo(
    () => estimateAtLegalMaximum({ amount, months, includeInsurance: cover }),
    [amount, months, cover],
  );
  const total = useEasedNumber(estimate.quote.totalRepayment);
  const instalment = useEasedNumber(estimate.instalment);

  const { minAmount, maxAmount, step } = SHORT_TERM_LOAN;
  const fill = ((amount - minAmount) / (maxAmount - minAmount)) * 100;

  const commitTyped = () => {
    if (typed === null) return;
    const parsed = Number(typed.replace(/[^\d]/g, ""));
    setAmount(clampAmount(parsed));
    setTyped(null);
  };

  return (
    <div
      id={id}
      data-polaris-calculator
      className="px-card px-calc w-full max-w-5xl overflow-hidden text-left"
    >
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-9 p-6 md:p-10">
          <div>
            <label htmlFor={amountId} className="px-eyebrow">
              How much do you need?
            </label>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="px-num text-3xl text-[var(--px-ink-2)] md:text-4xl">R</span>
              <input
                id={amountId}
                className="px-amount-input"
                inputMode="numeric"
                autoComplete="off"
                value={typed ?? groupThousands(String(amount))}
                onFocus={() => setTyped(String(amount))}
                onChange={(event) => setTyped(event.target.value)}
                onBlur={commitTyped}
                onKeyDown={(event) => {
                  if (event.key === "Enter") (event.target as HTMLInputElement).blur();
                }}
                aria-describedby={`${amountId}-range`}
              />
            </div>
            <input
              id={`${amountId}-range`}
              type="range"
              className="px-range mt-5"
              min={minAmount}
              max={maxAmount}
              step={step}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              aria-label="Loan amount"
              aria-valuetext={formatRand(amount)}
              style={{ "--px-fill": `${fill}%` } as React.CSSProperties}
            />
            <div className="mt-2 flex justify-between text-xs font-medium text-[var(--px-ink-3)]">
              <span>{formatRand(minAmount)}</span>
              <span>{formatRand(maxAmount)}</span>
            </div>
          </div>

          <div>
            <p className="px-eyebrow">Over how long?</p>
            <div role="group" aria-label="Term in months" className="px-seg mt-4">
              {MONTH_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={option === months}
                  onClick={() => setMonths(option)}
                >
                  {option}
                  <span className="sr-only"> {option === 1 ? "month" : "months"}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs font-medium text-[var(--px-ink-3)]">
              {months === 1 ? "One month, one instalment." : `${months} months, one instalment a month.`}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={cover}
            onClick={() => setCover((on) => !on)}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--px-line)] p-4 text-left transition-colors hover:border-[var(--px-ink-3)]"
          >
            <span>
              <span className="block font-semibold text-[var(--px-ink)]">Add credit life cover</span>
              <span className="mt-0.5 block text-sm leading-snug text-[var(--px-ink-2)]">
                Settles the loan if you die or lose your income. At most R4,50 per R1 000 a month.
              </span>
            </span>
            <span className="px-switch" aria-hidden="true" />
          </button>

          <p className="mt-auto text-xs leading-relaxed text-[var(--px-ink-3)]">
            Short-term credit under the National Credit Act: up to {formatRand(maxAmount)}, repaid
            within six months. Change the amount or the term and the figures follow.
          </p>
        </div>

        <div className="px-calc-result flex flex-col gap-7 border-t border-[var(--px-line)] p-6 md:p-10 lg:border-l lg:border-t-0">
          <p className="px-eyebrow">At the legal maximum</p>
          <div>
            <p className="text-sm font-medium text-[var(--px-ink-2)]">You repay in total</p>
            <p className="px-num mt-1 text-5xl leading-none text-[var(--px-ink)] md:text-6xl" aria-live="polite">
              {formatRand(total)}
            </p>
            <p className="mt-3 text-[var(--px-ink-2)]">
              {months === 1 ? (
                "In one instalment, a month from the payout."
              ) : (
                <>
                  That is{" "}
                  <strong className="px-num font-medium text-[var(--px-ink)]">
                    {formatRand(instalment)}
                  </strong>{" "}
                  a month for {months} months.
                </>
              )}
            </p>
          </div>

          <dl className="text-sm">
            <CostRow label="You borrow" value={estimate.amount} strong />
            <CostRow label="Interest" note="5% a month" value={estimate.quote.interest} />
            <CostRow label="Initiation fee" note="once" value={estimate.quote.initiationFee} />
            <CostRow label="Service fee" note="R60 a month" value={estimate.quote.serviceFee} />
            <CostRow label="VAT on the fees" note="15%" value={estimate.quote.vat} />
            {cover && (
              <CostRow label="Credit life cover" note="R4,50 per R1 000" value={estimate.quote.insurance} />
            )}
          </dl>

          <div>
            <div className="flex items-baseline justify-between gap-3 text-xs font-medium">
              <span className="text-[var(--px-ink-2)]">
                Cost of credit{" "}
                <span className="px-num text-sm text-[var(--px-ink)]">
                  {formatRand(estimate.costOfCredit)}
                </span>
              </span>
              <span className="text-[var(--px-ink-3)]">Ceiling {formatRand(estimate.amount)}</span>
            </div>
            <div className="px-bar mt-2" role="presentation">
              <span style={{ width: `${Math.round(estimate.costShare * 100)}%` }} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--px-ink-3)]">
              By law the cost of credit can never be more than the amount you borrow
              (National Credit Act, section 103(5)).
            </p>
          </div>

          <Link href={signupUrl} className="px-btn px-btn-ember w-full">
            Apply for {formatRand(estimate.amount)}
          </Link>
          <p className="text-xs leading-relaxed text-[var(--px-ink-3)]">
            An indication at the Act&rsquo;s ceilings, not an offer. Your offer is written after
            we check what you can afford, and it can only sit below these figures.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PolarisLoanCalculator;
