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


// "Why Polaris" on the landing, for base_sdk's page-sections registry: an
// editorial spread - the statement on the left, four numbered reasons on
// the right - in the theme's tokens. Copy: POLARIS_LANDING_CONFIG.why.
// Server-safe: no hooks, nothing to hydrate.

import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export function PolarisWhySection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.why;
  return (
    <section id={id} className="px-sky w-full py-20 md:py-28">
      <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:px-0">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <p className="px-eyebrow">{copy.eyebrow}</p>
          <h2 className="px-display text-balance text-4xl md:text-5xl lg:text-6xl">
            Lending, with the <em>lights on.</em>
          </h2>
          <p className="px-lede max-w-md">{copy.blurb}</p>
          <div className="px-hair mt-2 w-40" aria-hidden="true" />
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          {copy.items.map((item, index) => (
            <li key={item.title} className="px-card flex flex-col gap-5 p-6 md:p-7">
              <span className="px-num text-3xl text-[var(--px-ember-text)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="px-display text-2xl">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-[var(--px-ink-2)]">{item.text}</p>
              </div>
            </li>
          ))}
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
