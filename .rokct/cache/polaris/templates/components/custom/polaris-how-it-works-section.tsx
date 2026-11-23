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


// "How it works" (v3, section 02): the four steps as one row across the
// page, each with its own screen above it - the month bar, the two fields,
// the two uploads, the contract with its two answers - so the visitor sees
// what each step asks of them before reading it. A rail joins the four
// numbers; the first is lime, the step the visitor is about to take.
import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import { UI_STEP_PICTURES } from "@/components/custom/landing/polaris-product-ui";
import { PolarisSectionHead } from "@/components/custom/landing/polaris-section-head";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

import t from "@/app/lib/i18n";
import { tx } from "@/app/lib/i18n/phrases";
export function PolarisHowItWorksSection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.how;
  return (
    <section id={id} className="px-band-2 px-section w-full">
      <div className="px-wrap">
        <PolarisSectionHead
          index="02"
          eyebrow={copy.eyebrow}
          title={
            <>
              {tx("Four steps,")}{" "}<em>{tx("all of them")}</em> {tx("in your browser.")}
            </>
          }
          blurb={copy.note}
        />
        <ol className="px-steps">
          {copy.steps.map((step, index) => {
            const Picture = UI_STEP_PICTURES[index];
            return (
              <li key={step.title} className="px-step">
                <div className="px-step-pic px-ui" aria-hidden="true">
                  {Picture ? <Picture /> : null}
                </div>
                <div className="px-step-rail">
                  <i className={index === 0 ? "on" : undefined} aria-hidden="true">
                    {index + 1}
                  </i>
                  <span className="when">{tx(copy.when[index])}</span>
                </div>
                <h3 className="px-step-title">{tx(step.title)}</h3>
                <p className="px-step-text">{tx(step.text)}</p>
              </li>
            );
          })}
        </ol>
        <div className="px-next px-next-wide">
          <b>{t("polaris.next")}</b>
          <span>{tx(copy.next)}</span>
        </div>
      </div>
    </section>
  );
}

export const meta: PageSectionMeta = {
  order: 40,
  nav: [{ id: "how-it-works", label: "How it works" }],
};

export default function PolarisHowItWorksPageSection({ id }: PageSectionProps) {
  return <PolarisHowItWorksSection id={id} />;
}
