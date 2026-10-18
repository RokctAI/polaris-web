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


// "How it works" on the Polaris web app's landing, for base_sdk's
// page-sections registry: the four steps of the borrower's journey, the
// same steps the apply flow walks (polaris/docs/web-app.md section 4), on
// an ember line with a numbered node each. Copy: POLARIS_LANDING_CONFIG.how.
// Server-safe: no hooks.

import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export function PolarisHowItWorksSection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.how;
  return (
    <section id={id} className="px-sky-2 w-full border-y border-[var(--px-line-soft)] py-20 md:py-28">
      <div className="container mx-auto flex max-w-6xl flex-col gap-14 px-4 xl:px-0">
        <div className="flex flex-col items-start gap-5 md:max-w-2xl">
          <p className="px-eyebrow">{copy.eyebrow}</p>
          <h2 className="px-display text-balance text-4xl md:text-5xl">
            Four steps, <em>all of them</em> in your browser.
          </h2>
        </div>
        <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div
            aria-hidden="true"
            className="px-hair absolute left-6 top-6 hidden w-[calc(100%-3rem)] lg:block"
          />
          {copy.steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-6">
              <span className="px-step-node relative z-10 flex-none">{index + 1}</span>
              <div className="flex flex-col gap-2">
                <h3 className="px-display text-2xl">{step.title}</h3>
                <p className="text-[15px] leading-relaxed text-[var(--px-ink-2)]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-sm font-medium text-[var(--px-ink-3)]">{copy.note}</p>
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
