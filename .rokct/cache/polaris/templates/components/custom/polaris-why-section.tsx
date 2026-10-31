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

// "Why": one picture, the month bar the app's affordability step draws -
// income as the whole bar, living and debts and this loan drawn into it,
// what is left at the end. The four reasons sit beside it as a plain list.
// Lime appears once: the loan's slice of the month.
import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import { formatRand } from "@/components/custom/landing/polaris-loan-presets";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

function MonthBar() {
  const m = POLARIS_LANDING_CONFIG.why.month;
  const left = m.income - m.living - m.debts - m.loan;
  const pct = (v: number) => `${(v / m.income) * 100}%`;
  return (
    <figure className="px-card px-month p-6 md:p-7">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="px-eyebrow">Your month</span>
        <span className="px-k">income {formatRand(m.income, { cents: true })}</span>
      </figcaption>
      <div className="bar" role="img" aria-label={m.verdict}>
        <i className="seg-exp" style={{ width: pct(m.living) }} />
        <i className="seg-debt" style={{ width: pct(m.debts) }} />
        <i className="seg-loan" style={{ width: pct(m.loan) }} />
        <i className="seg-left" style={{ width: pct(left) }} />
      </div>
      <div className="px-legend">
        <div>
          <i className="seg-exp" />
          Living<b>{formatRand(m.living, { cents: true })}</b>
        </div>
        <div>
          <i className="seg-debt" />
          Debts<b>{formatRand(m.debts, { cents: true })}</b>
        </div>
        <div>
          <i className="seg-loan" />
          This loan<b>{formatRand(m.loan, { cents: true })}</b>
        </div>
        <div>
          <i className="seg-left" />
          Left over<b>{formatRand(left, { cents: true })}</b>
        </div>
      </div>
      <p className="px-verdict">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {m.verdict}
      </p>
      <p className="px-fine mt-4">{m.caption}</p>
    </figure>
  );
}

export function PolarisWhySection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.why;
  return (
    <section id={id} className="px-sky-2 px-section w-full">
      <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_1fr] lg:gap-20 xl:px-0">
        <div className="flex flex-col gap-6">
          <p className="px-eyebrow">{copy.eyebrow}</p>
          <h2 className="px-display text-4xl md:text-5xl">
            Lending, with the <em>lights on.</em>
          </h2>
          <p className="px-lede max-w-lg">{copy.blurb}</p>
          <div className="lg:mt-2">
            <MonthBar />
          </div>
        </div>
        <ol className="flex flex-col divide-y divide-[var(--px-sub)] lg:pt-16">
          {copy.items.map((item, index) => (
            <li key={item.title} className="grid grid-cols-[2.25rem_1fr] gap-4 py-6 first:pt-0">
              <span className="px-num pt-0.5 text-sm font-semibold text-[var(--px-faint)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-[var(--px-ink)]">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--px-sec)]">{item.text}</p>
              </div>
            </li>
          ))}
          <li className="pt-6">
            <div className="px-next">
              <b>Next</b>
              <span>{copy.next}</span>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

export const meta: PageSectionMeta = {
  order: 20,
  nav: [{ id: "why", label: "Why Polaris" }],
};

export default function PolarisWhyPageSection({ id }: PageSectionProps) {
  return <PolarisWhySection id={id} />;
}
