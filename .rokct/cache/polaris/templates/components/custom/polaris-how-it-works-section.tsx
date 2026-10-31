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

// "How it works": one picture, the timeline the app's consent and review
// screens share. Each step says how long it takes. Lime appears once, on
// the step the visitor is about to take.
import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export function PolarisHowItWorksSection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.how;
  return (
    <section id={id} className="px-sky px-section w-full">
      <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:px-0">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <p className="px-eyebrow">{copy.eyebrow}</p>
          <h2 className="px-display text-4xl md:text-5xl">
            Four steps, <em>all of them</em> in your browser.
          </h2>
          <p className="px-lede max-w-md">{copy.note}</p>
        </div>
        <div className="px-card p-6 md:p-8">
          <ol className="px-tl">
            {copy.steps.map((step, index) => (
              <li key={step.title}>
                <i className={index === 0 ? "on" : undefined} aria-hidden="true">
                  {index + 1}
                </i>
                <div>
                  <span className="when">
                    {index === 0 ? "Start here" : `Step ${index + 1}`} · {copy.when[index]}
                  </span>
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-[var(--px-ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[var(--px-sec)]">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="px-next mt-8">
            <b>Next</b>
            <span>{copy.next}</span>
          </div>
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
