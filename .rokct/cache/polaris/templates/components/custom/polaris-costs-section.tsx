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


// "What it costs" on the Polaris landing, for base_sdk's page-sections
// registry: the National Credit Act's ceilings on a short-term loan as a
// price list, line by line, ending on the one ceiling over all of them
// (s103(5)). The figures are the law's, not the lender's - the same
// numbers polaris-loan-presets.ts feeds the calculator. Copy:
// POLARIS_LANDING_CONFIG.costs. Server-safe: no hooks.

import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export function PolarisCostsSection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.costs;
  return (
    <section id={id} className="px-sky w-full py-20 md:py-28">
      <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_1.2fr] lg:gap-20 xl:px-0">
        <div className="flex flex-col gap-6">
          <p className="px-eyebrow">{copy.eyebrow}</p>
          <h2 className="px-display text-balance text-4xl md:text-5xl">
            What a short-term loan can cost, <em>by law.</em>
          </h2>
          <p className="px-lede max-w-md">{copy.blurb}</p>
        </div>
        <div className="px-card overflow-hidden">
          <dl className="px-6 pt-2 md:px-8">
            {copy.rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-[var(--px-line-soft)] py-5 sm:grid-cols-[1fr_auto]"
              >
                <dt className="font-semibold text-[var(--px-ink)]">{row.label}</dt>
                <dd className="px-num text-right text-2xl text-[var(--px-ink)] md:text-3xl">
                  {row.value}
                </dd>
                <dd className="col-span-2 text-sm text-[var(--px-ink-2)]">{row.note}</dd>
              </div>
            ))}
          </dl>
          <div className="px-band flex gap-4 p-6 md:p-8">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-[0.22em] opacity-70">
                {copy.cap.label}
              </p>
              <p className="px-display text-2xl !text-[var(--px-ember-ink)] md:text-3xl">
                {copy.cap.value}
              </p>
              <p className="text-sm font-medium opacity-80">{copy.cap.note}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="container mx-auto mt-8 max-w-6xl px-4 text-xs leading-relaxed text-[var(--px-ink-3)] xl:px-0">
        {copy.footnote}
      </p>
    </section>
  );
}

export const meta: PageSectionMeta = {
  order: 60,
  nav: [{ id: "costs", label: "What it costs" }],
};

export default function PolarisCostsPageSection({ id }: PageSectionProps) {
  return <PolarisCostsSection id={id} />;
}
