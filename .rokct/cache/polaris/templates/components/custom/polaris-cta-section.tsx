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


// The close (v3): one dark panel in both themes - the only surface on the
// page that does not follow the mode, so the last thing the visitor sees
// is the darkest and the one lime button on it the brightest. The headline
// at the size of the hero's; under it, what happens next as a row of four
// with a time against each.
import React from "react";
import Link from "next/link";

import { fetchPolarisDownloadAvailability } from "@/app/download/release";
import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import { PolarisStoreBadges } from "@/components/custom/landing/polaris-store-badges";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export async function PolarisCtaSection({
  id,
  signupUrl,
  loginUrl,
}: {
  id?: string;
  signupUrl: string;
  loginUrl: string;
}) {
  const copy = POLARIS_LANDING_CONFIG.cta;
  const available = await fetchPolarisDownloadAvailability();
  return (
    <section id={id} className="px-band px-section px-section-tight w-full">
      <div className="px-wrap">
        <div className="px-cta">
          <div className="px-cta-top">
            <div>
              <p className="px-head-index">
                <span>→</span>
                What happens next
              </p>
              <h2 className="px-display px-cta-h">{copy.heading}</h2>
            </div>
            <div className="px-cta-side">
              <p className="px-lede">{copy.blurb}</p>
              <div className="px-cta-buttons">
                <Link href={signupUrl} className="px-btn px-btn-lime px-btn-lg">
                  {copy.primary}
                </Link>
                <Link href={loginUrl} className="px-btn px-btn-ghost px-btn-lg">
                  {copy.secondary}
                </Link>
              </div>
              <PolarisStoreBadges available={available} className="px-cta-stores" />
            </div>
          </div>
          <ol className="px-cta-steps">
            {copy.steps.map((step, index) => (
              <li key={step.text}>
                <i aria-hidden="true">{index + 1}</i>
                <span className="when">{step.when}</span>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export const meta: PageSectionMeta = {
  order: 90,
  nav: [],
  anchor: "apply",
};

export default function PolarisCtaPageSection({ id, signupUrl, loginUrl }: PageSectionProps) {
  return <PolarisCtaSection id={id} signupUrl={signupUrl} loginUrl={loginUrl} />;
}
