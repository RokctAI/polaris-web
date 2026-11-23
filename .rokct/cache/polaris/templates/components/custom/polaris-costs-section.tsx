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

import t from "@/app/lib/i18n";
import { tx } from "@/app/lib/i18n/phrases";
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
              {tx("What short-term credit can cost,")}{" "}<em>{tx("by law.")}</em>
            </>
          }
          blurb={copy.blurb}
        />

        <div className="px-calc-wrap">
          <PolarisLoanCalculator signupUrl={signupUrl} id="calculator" />
          <div className="px-next">
            <b>{t("polaris.next")}</b>
            <span>{tx(POLARIS_LANDING_CONFIG.hero.next)}</span>
          </div>
        </div>

        <dl className="px-caps">
          {copy.rows.map((row) => (
            <div key={row.label}>
              <dt>{tx(row.label)}</dt>
              <dd className="px-caps-value">{tx(row.value)}</dd>
              <dd className="px-caps-note">{tx(row.note)}</dd>
            </div>
          ))}
        </dl>

        <div className="px-ceiling">
          <p className="px-head-index">
            <span>§</span>
            {tx(copy.cap.label)}
          </p>
          <div>
            <p className="px-display px-ceiling-line">
              {t("polaris.the_cost_of_credit_can_never_be_more_than")} <mark>{tx("the amount you borrow.")}</mark>
            </p>
            <p className="px-k mt-4">
              {tx(copy.cap.note)} {tx(copy.next)}
            </p>
            <p className="px-fine mt-3 max-w-2xl">{tx(copy.footnote)}</p>
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
