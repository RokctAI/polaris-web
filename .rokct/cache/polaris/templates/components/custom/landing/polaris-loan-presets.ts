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


// The maths behind the landing's loan calculator: what a short-term loan
// costs AT THE NATIONAL CREDIT ACT'S CAPS, worked by the SDK's own NCR
// engine (app/lib/lending/ncr_calculator.ts, the one the back office quotes
// with). The landing fixes no rate of its own (polaris/docs/web-app.md:
// "no rates, approval times or amounts: none is fixed in any source"); the
// law's ceilings are public, so the page shows the most a loan can cost and
// says so. A lender's offer is written under them and can only be lower.
//
// Short-term credit under the Act: up to R8 000, repaid within six months
// (Regulation 39). Interest up to 5% a month (Reg 42), the initiation fee
// R165 plus 10% of the amount over R1 000 and never above R1 050 (Reg 42),
// the service fee up to R60 a month (Reg 44), VAT on the two fees, credit
// life cover up to R4.50 per R1 000 a month (Reg 106), and the total cost of
// credit never above the principal (s103(5)) - the last one the engine
// asserts and the calculator draws as a bar.
//
// Pure: no React, no host import beyond the engine. Relative import on
// purpose so the module resolves identically in the SDK tree and once
// installed (components/custom/landing -> app/lib/lending at the same
// depth), and a plain node run can exercise it.

import {
  calculateNCRQuote,
  NCR_MAX_INTEREST_RATE_SHORT_TERM,
  NCR_MAX_SERVICE_FEE_PM,
  NCR_VAT_RATE,
  type QuoteResult,
} from "../../../app/lib/lending/ncr_calculator";

/** The short-term credit envelope the calculator moves inside. */
export const SHORT_TERM_LOAN = {
  minAmount: 500,
  maxAmount: 8000,
  step: 100,
  minMonths: 1,
  maxMonths: 6,
  /** The engine prices interest per 30 days; a month is one of those. */
  daysPerMonth: 30,
  defaultAmount: 3000,
  /** Polaris repays once-off: one repayment, a month after the payout. */
  defaultMonths: 1,
} as const;

/**
 * The terms the Act allows a short-term loan (1 to 6 months). The calculator
 * still draws every one of them, so a visitor sees what the law allows, but
 * only ONCE_OFF_MONTHS is open: Polaris repays once-off (Ray, 2026-10-31:
 * "we do once off i think it should lock other months").
 */
export const MONTH_OPTIONS: readonly number[] = [1, 2, 3, 4, 5, 6];

/** The one term Polaris offers: a single repayment, one month (30 days) after the payout. */
export const ONCE_OFF_MONTHS = 1;

/** Whether a term can be chosen: only the once-off month is open, the rest are drawn locked. */
export function isMonthOptionOpen(months: number): boolean {
  return months === ONCE_OFF_MONTHS;
}

/** Regulation 42's initiation fee ceiling for `principal`, in rand. */
export function statutoryInitiationFee(principal: number): number {
  return Math.min(1050, 165 + Math.max(0, principal - 1000) * 0.1);
}

/** That ceiling as the percentage the engine's `initiationFeePercent` takes. */
export function initiationFeePercentAtCap(principal: number): number {
  if (!(principal > 0)) return 0;
  return (statutoryInitiationFee(principal) / principal) * 100;
}

/** `value` snapped to the step and held inside the envelope. */
export function clampAmount(value: number): number {
  const { minAmount, maxAmount, step } = SHORT_TERM_LOAN;
  if (!Number.isFinite(value)) return minAmount;
  const stepped = Math.round(value / step) * step;
  return Math.min(maxAmount, Math.max(minAmount, stepped));
}

export function clampMonths(value: number): number {
  const { minMonths, maxMonths } = SHORT_TERM_LOAN;
  if (!Number.isFinite(value)) return SHORT_TERM_LOAN.defaultMonths;
  return Math.min(maxMonths, Math.max(minMonths, Math.round(value)));
}

export interface LoanEstimate {
  amount: number;
  months: number;
  days: number;
  /** The engine's quote at the caps, with its compliance warnings. */
  quote: QuoteResult;
  /** The total split evenly over the months. */
  instalment: number;
  /** Everything above the amount borrowed: interest, fees, VAT, cover. */
  costOfCredit: number;
  /** costOfCredit as a share of the s103(5) ceiling (the amount), 0 to 1. */
  costShare: number;
}

function round2(value: number): number {
  return Number(value.toFixed(2));
}

/** The most `amount` over `months` can cost under the Act. */
export function estimateAtLegalMaximum({
  amount,
  months,
  includeInsurance = false,
}: {
  amount: number;
  months: number;
  includeInsurance?: boolean;
}): LoanEstimate {
  const principal = clampAmount(amount);
  const term = clampMonths(months);
  const days = term * SHORT_TERM_LOAN.daysPerMonth;
  const quote = calculateNCRQuote({
    principal,
    days,
    interestRateMonthly: NCR_MAX_INTEREST_RATE_SHORT_TERM,
    monthlyServiceFee: NCR_MAX_SERVICE_FEE_PM,
    initiationFeePercent: initiationFeePercentAtCap(principal),
    vatRate: NCR_VAT_RATE,
    includeInsurance,
  });
  const costOfCredit = round2(quote.totalRepayment - principal);
  return {
    amount: principal,
    months: term,
    days,
    quote,
    instalment: round2(quote.totalRepayment / term),
    costOfCredit,
    costShare: principal > 0 ? Math.min(1, Math.max(0, costOfCredit / principal)) : 0,
  };
}

/** Thousands grouped with a no-break space, the South African way (a full space: the narrow one is near-invisible in the display face). */
export function groupThousands(whole: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

/** "R3 000", or "R3 000,50" with `cents`; a negative value keeps its sign. */
export function formatRand(value: number, { cents = false }: { cents?: boolean } = {}): string {
  const abs = Math.abs(value);
  const fixed = cents ? abs.toFixed(2) : Math.round(abs).toString();
  const [whole, fraction] = fixed.split(".");
  const sign = value < 0 ? "−" : "";
  return `${sign}R${groupThousands(whole)}${fraction ? `,${fraction}` : ""}`;
}
