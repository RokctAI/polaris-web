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


// The client half of polaris-faq-section.tsx: the one open question, each
// answer revealed by a grid-rows transition (no motion library), the
// toggle a real button with aria-expanded and aria-controls.

"use client";

import React, { useId, useState } from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";

export function PolarisFaqSection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.faq;
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id={id} className="px-sky-2 w-full border-t border-[var(--px-line-soft)] py-20 md:py-28">
      <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 xl:px-0">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <p className="px-eyebrow">{copy.eyebrow}</p>
          <h2 className="px-display text-balance text-4xl md:text-5xl">
            Asked <em>before</em> you apply.
          </h2>
        </div>
        <div className="flex flex-col">
          {copy.items.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;
            return (
              <div key={item.question} className="border-b border-[var(--px-line)] first:border-t">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
                  >
                    <span className="px-display text-xl md:text-2xl">{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="px-faq-mark px-num flex-none text-3xl font-light leading-none text-[var(--px-ember-text)]"
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-faq-body"
                  data-open={isOpen}
                >
                  <div>
                    <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-[var(--px-ink-2)]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PolarisFaqSection;
