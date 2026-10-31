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

// v3: no longer the hero; the "What it costs" section draws it at the
// page's full width, in the same browser-window frame as the hero's screen.
// The two halves are balanced so neither leaves dead space: the cost of
// credit and its legal line sit under the controls (a live read-out of what
// the choices cost), the receipt keeps the total, the lines and the action,
// and each half's fine print follows its own content.
//
// 1.9.1: Polaris repays once-off. The term row still draws the Act's one
// to six months, but only the one month is open; the others are drawn
// locked (disabled, muted, a small lock), so the receipt is always one
// repayment a month after the payout. The section is also drawn tighter.
//
// The hero's one picture: the receipt. The left half is what the borrower
// chooses (amount, term, cover); the right half is the receipt the app's
// Agreement step prints - every line of the cost on tabular numerals,
// right-aligned, the total as one number, and the repayment date written
// out in full. Lime appears once, on the action. (v2 standard: one picture
// per screen, lime means go, money is tabular, say what happens next.)
"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";

import {
  clampAmount,
  estimateAtLegalMaximum,
  formatRand,
  groupThousands,
  isMonthOptionOpen,
  MONTH_OPTIONS,
  ONCE_OFF_MONTHS,
  SHORT_TERM_LOAN,
} from "./polaris-loan-presets";

function IconLock({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 017 0v2.7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

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

/** "Monday, 30 November 2026": dates are written out, never numeric. */
export function longDate(date: Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** The payout date plus `months` calendar months, clamped to the month's last day. */
export function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(date.getDate(), last));
  return next;
}

function Line({
  label,
  note,
  value,
}: {
  label: string;
  note?: string;
  value: number;
}) {
  return (
    <div className="px-lr">
      <dt>
        {label}
        {note && <span className="ml-1.5 text-xs text-[var(--px-faint)]">{note}</span>}
      </dt>
      <dd className="px-money">
        <b>{formatRand(value, { cents: true })}</b>
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
  // Once-off: the term is fixed at the one open month; the other months are drawn locked.
  const [months, setMonths] = useState<number>(ONCE_OFF_MONTHS);
  const [cover, setCover] = useState(false);
  // The calendar is the visitor's, read after hydration so the server's HTML
  // and the client's first paint agree.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  const amountId = useId();

  const estimate = useMemo(
    () => estimateAtLegalMaximum({ amount, months, includeInsurance: cover }),
    [amount, months, cover],
  );
  const total = useEasedNumber(estimate.quote.totalRepayment);
  const { minAmount, maxAmount, step } = SHORT_TERM_LOAN;
  const fill = ((amount - minAmount) / (maxAmount - minAmount)) * 100;
  const due = today ? addMonths(today, months) : null;

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
      className="px-window px-calc w-full overflow-hidden text-left"
    >
      <div className="px-window-bar" aria-hidden="true">
        <span className="px-window-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="px-window-url">Loan calculator</span>
        <span className="px-window-label">Not yet an offer</span>
      </div>
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        {/* ------------------------------------------------ what you choose */}
        <div className="flex flex-col gap-3.5 p-5 md:px-7 md:py-6">
          <div>
            <label htmlFor={amountId} className="px-eyebrow">
              How much do you need?
            </label>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="px-num text-3xl font-medium text-[var(--px-sec)] md:text-4xl">R</span>
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
              className="px-range mt-4"
              min={minAmount}
              max={maxAmount}
              step={step}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              aria-label="Loan amount"
              aria-valuetext={formatRand(amount)}
              style={{ "--px-fill": `${fill}%` } as React.CSSProperties}
            />
            <div className="px-num mt-2 flex justify-between text-xs font-medium text-[var(--px-faint)]">
              <span>{formatRand(minAmount)}</span>
              <span>{formatRand(maxAmount)}</span>
            </div>
          </div>

          <div>
            <p className="px-eyebrow">Over how long?</p>
            <div role="group" aria-label="Term in months" className="px-seg mt-3">
              {MONTH_OPTIONS.map((option) => {
                const open = isMonthOptionOpen(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={option === months}
                    disabled={!open}
                    data-locked={open ? undefined : ""}
                    title={open ? undefined : "Polaris repays once-off"}
                    onClick={() => open && setMonths(option)}
                  >
                    {!open && <IconLock />}
                    {option}
                    <span className="sr-only">
                      {" "}
                      {option === 1 ? "month" : "months"}
                      {open ? "" : ", locked: Polaris repays once-off"}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="px-k mt-2">Once-off: one repayment, a month after the payout.</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={cover}
            onClick={() => setCover((on) => !on)}
            className="px-alt flex items-center justify-between gap-4 rounded-[14px] p-4 text-left shadow-[0_0_0_1px_var(--px-sub)] transition-shadow hover:shadow-[0_0_0_1px_var(--px-stroke)]"
          >
            <span>
              <span className="block text-[15px] font-semibold text-[var(--px-ink)]">
                Add credit life cover
              </span>
              <span className="px-k mt-0.5 block leading-snug">
                Settles the loan if you die or lose your income. At most R4,50 per R1 000 a month.
              </span>
            </span>
            <span className="px-switch" aria-hidden="true" />
          </button>

          <div>
            <div className="px-cost">
              <span>Cost of credit, all in</span>
              <b className="px-money">{formatRand(estimate.costOfCredit, { cents: true })}</b>
            </div>
            <div className="px-bar mt-2.5" role="presentation">
              <span style={{ width: `${Math.round(estimate.costShare * 100)}%` }} />
            </div>
            <p className="px-fine mt-2">
              By law the cost of credit can never be more than the amount you borrow (National Credit
              Act, section 103(5)). The bar is how far this loan sits from that line. Short-term
              credit under the Act: up to {formatRand(maxAmount)}, repaid within six months; Polaris
              is repaid once-off. Change the amount and the figures follow.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------- the receipt */}
        <div className="px-alt flex flex-col gap-4 border-t border-[var(--px-sub)] p-5 md:px-7 md:py-6 lg:border-l lg:border-t-0">
          <div className="flex items-baseline justify-between gap-4">
            <p className="px-eyebrow">At the legal maximum</p>
            <p className="px-k">Not yet an offer</p>
          </div>

          <div>
            <p className="px-k font-medium">You repay in total</p>
            <p
              className="px-num mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-[var(--px-ink)] md:text-[3rem]"
              aria-live="polite"
            >
              {formatRand(total, { cents: true })}
            </p>
            <p className="mt-2.5 text-[15px] leading-snug text-[var(--px-sec)]">
              Once-off, in one repayment
              {due ? (
                <>
                  {" "}
                  on <b className="font-semibold text-[var(--px-ink)]">{longDate(due)}</b>
                </>
              ) : (
                ", a month from the payout"
              )}
              .
            </p>
          </div>

          <dl className="rc">
            <Line label="You borrow" value={estimate.amount} />
            <Line label="Interest" note="5% a month" value={estimate.quote.interest} />
            <Line label="Initiation fee" note="once" value={estimate.quote.initiationFee} />
            <Line label="Service fee" note="R60 a month, at most" value={estimate.quote.serviceFee} />
            <Line label="VAT on the fees" note="15%" value={estimate.quote.vat} />
            {cover && (
              <Line label="Credit life cover" note="R4,50 per R1 000" value={estimate.quote.insurance} />
            )}
            <div className="px-lr tot">
              <dt>Total to repay</dt>
              <dd className="px-money">
                <b>{formatRand(estimate.quote.totalRepayment, { cents: true })}</b>
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-col gap-3">
            <Link href={signupUrl} className="px-btn px-btn-lime w-full">
              Apply for {formatRand(estimate.amount)}
            </Link>
            <p className="px-fine">
              An indication at the Act&rsquo;s ceilings, not an offer. Your offer is written after we
              check what you can afford, and it can only sit below these figures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolarisLoanCalculator;
