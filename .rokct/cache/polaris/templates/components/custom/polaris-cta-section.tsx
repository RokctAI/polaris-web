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

// The close: what happens next, in order and with a time against each
// line, then the one lime button on this screen. No lime band: the brand
// colour is the action, not the wallpaper.
import React from "react";
import Link from "next/link";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export function PolarisCtaSection({
  id,
  signupUrl,
  loginUrl,
}: {
  id?: string;
  signupUrl: string;
  loginUrl: string;
}) {
  const copy = POLARIS_LANDING_CONFIG.cta;
  return (
    <section id={id} className="px-sky-2 px-section w-full">
      <div className="container mx-auto max-w-6xl px-4 xl:px-0">
        <div className="px-card grid gap-10 p-7 md:grid-cols-[1fr_1fr] md:p-12 lg:gap-16">
          <div className="flex flex-col gap-4">
            <p className="px-eyebrow">What happens next</p>
            <h2 className="px-display text-4xl md:text-5xl">{copy.heading}</h2>
            <p className="px-lede max-w-md">{copy.blurb}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href={signupUrl} className="px-btn px-btn-lime">
                {copy.primary}
              </Link>
              <Link href={loginUrl} className="px-btn px-btn-ghost">
                {copy.secondary}
              </Link>
            </div>
          </div>
          <ol className="px-tl md:pt-2">
            {copy.steps.map((step, index) => (
              <li key={step.text}>
                <i aria-hidden="true">{index + 1}</i>
                <div>
                  <span className="when">{step.when}</span>
                  <p className="text-[15px] font-medium leading-snug text-[var(--px-ink)]">{step.text}</p>
                </div>
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
