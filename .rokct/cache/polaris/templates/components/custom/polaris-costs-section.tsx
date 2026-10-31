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

// "What it costs": one picture, the ceiling. The Act's caps as a receipt
// (label left, figure right on tabular numerals), and under it the one
// rule above all of them, set as the one lime fact on this screen.
import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export function PolarisCostsSection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.costs;
  return (
    <section id={id} className="px-sky-2 px-section w-full">
      <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_1.15fr] lg:gap-20 xl:px-0">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <p className="px-eyebrow">{copy.eyebrow}</p>
          <h2 className="px-display text-4xl md:text-5xl">
            What a short-term loan can cost, <em>by law.</em>
          </h2>
          <p className="px-lede max-w-md">{copy.blurb}</p>
          <p className="px-fine max-w-md">{copy.footnote}</p>
        </div>
        <div className="flex flex-col gap-4">
          <dl className="px-card px-6 py-2 md:px-8">
            {copy.rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-[var(--px-sub)] py-4 last:border-b-0"
              >
                <dt className="text-[15px] font-semibold text-[var(--px-ink)]">{row.label}</dt>
                <dd className="px-money text-xl font-semibold text-[var(--px-ink)] md:text-2xl">
                  {row.value}
                </dd>
                <dd className="col-span-2 text-sm text-[var(--px-sec)]">{row.note}</dd>
              </div>
            ))}
          </dl>
          <div className="px-card relative overflow-hidden p-6 md:p-8">
            <p className="px-eyebrow">{copy.cap.label}</p>
            <p className="px-display mt-3 text-2xl md:text-[1.75rem]">{copy.cap.value}</p>
            <p className="px-k mt-2">{copy.cap.note}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[10px] bg-[var(--px-alt)] p-3 shadow-[0_0_0_1px_var(--px-sub)]">
                <p className="px-fine">You borrow</p>
                <div className="px-bar mt-2">
                  <span style={{ width: "100%" }} />
                </div>
              </div>
              <div className="rounded-[10px] bg-[var(--px-alt)] p-3 shadow-[0_0_0_1px_var(--px-sub)]">
                <p className="px-fine">The cost, at most</p>
                <div className="px-bar mt-2">
                  <span style={{ width: "100%", background: "var(--px-lime)" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="px-next">
            <b>Next</b>
            <span>{copy.next}</span>
          </div>
        </div>
      </div>
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
