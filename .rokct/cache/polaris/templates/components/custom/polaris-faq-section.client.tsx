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


// "Questions" (v3, section 04): every answer open, in two ruled columns.
// Six short answers read faster laid out than folded away, and an
// accordion that hides five of them made the page look emptier than it is.
// Kept as the client half the entry module draws (the registry contract
// in page-sections.ts), though it no longer holds state.
"use client";

import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import { PolarisSectionHead } from "@/components/custom/landing/polaris-section-head";

export function PolarisFaqSection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.faq;
  return (
    <section id={id} className="px-band-2 px-section w-full">
      <div className="px-wrap">
        <PolarisSectionHead
          index="04"
          eyebrow={copy.eyebrow}
          title={
            <>
              Asked <em>before</em> you apply.
            </>
          }
          blurb="Anything else, ask us on the page once you have an account."
        />
        <dl className="px-faq">
          {copy.items.map((item, index) => (
            <div key={item.question}>
              <dt>
                <span className="px-faq-n">Q{index + 1}</span>
                {item.question}
              </dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default PolarisFaqSection;
