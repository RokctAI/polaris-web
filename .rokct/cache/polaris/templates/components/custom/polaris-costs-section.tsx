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


// "What it costs" (v3, section 01): the calculator gets the page's full
// width here - moved out of the hero, where it had to share the screen
// with the headline - framed as the window it is in the borrower area.
// Under it the Act's five ceilings as one ruled spec row (label in mono,
// figure in the display face, the condition under it), and the one rule
// above all of them set as the section's closing line, lime-underlined.
import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import { PolarisLoanCalculator } from "@/components/custom/landing/polaris-loan-calculator";
import { PolarisSectionHead } from "@/components/custom/landing/polaris-section-head";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export function PolarisCostsSection({ id, signupUrl }: { id?: string; signupUrl: string }) {
  const copy = POLARIS_LANDING_CONFIG.costs;
  return (
    <section id={id} className="px-band px-section px-section-costs w-full">
      <div className="px-wrap">
        <PolarisSectionHead
          index="01"
          eyebrow={copy.eyebrow}
          title={
            <>
              What short-term credit can cost, <em>by law.</em>
            </>
          }
          blurb={copy.blurb}
        />

        <div className="px-calc-wrap">
          <PolarisLoanCalculator signupUrl={signupUrl} id="calculator" />
          <div className="px-next">
            <b>Next</b>
            <span>{POLARIS_LANDING_CONFIG.hero.next}</span>
          </div>
        </div>

        <dl className="px-caps">
          {copy.rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd className="px-caps-value">{row.value}</dd>
              <dd className="px-caps-note">{row.note}</dd>
            </div>
          ))}
        </dl>

        <div className="px-ceiling">
          <p className="px-head-index">
            <span>§</span>
            {copy.cap.label}
          </p>
          <div>
            <p className="px-display px-ceiling-line">
              The cost of credit can never be more than <mark>the amount you borrow.</mark>
            </p>
            <p className="px-k mt-4">
              {copy.cap.note} {copy.next}
            </p>
            <p className="px-fine mt-3 max-w-2xl">{copy.footnote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export const meta: PageSectionMeta = {
  order: 20,
  nav: [{ id: "costs", label: "What it costs" }],
};

export default function PolarisCostsPageSection({ id, signupUrl }: PageSectionProps) {
  return <PolarisCostsSection id={id} signupUrl={signupUrl} />;
}
