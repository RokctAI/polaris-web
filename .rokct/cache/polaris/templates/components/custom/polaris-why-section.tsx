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


// "Why Polaris" (v3, section 03): the brand line set as the largest type
// on the page after the hero, the blurb beside it, and the four reasons as
// four ruled columns under it - each with its number in mono. The month bar
// this section used to carry is now the hero's screen.
import React from "react";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export function PolarisWhySection({ id }: { id?: string }) {
  const copy = POLARIS_LANDING_CONFIG.why;
  return (
    <section id={id} className="px-band px-section w-full">
      <div className="px-wrap">
        <div className="px-why-head">
          <p className="px-head-index">
            <span>03</span>
            {copy.eyebrow}
          </p>
          <h2 className="px-display px-mega">
            Lending, with the <em>lights on.</em>
          </h2>
          <p className="px-lede px-why-blurb">{copy.blurb}</p>
        </div>
        <ol className="px-why-grid">
          {copy.items.map((item, index) => (
            <li key={item.title}>
              <span className="px-why-num">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export const meta: PageSectionMeta = {
  order: 60,
  nav: [{ id: "why", label: "Why Polaris" }],
};

export default function PolarisWhyPageSection({ id }: PageSectionProps) {
  return <PolarisWhySection id={id} />;
}
