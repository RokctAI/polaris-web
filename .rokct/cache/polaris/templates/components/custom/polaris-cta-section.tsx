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


// The closing call on the Polaris landing, for base_sdk's page-sections
// registry: one gold band, two doors - sign up, or sign in. Not a nav stop.
// Copy: POLARIS_LANDING_CONFIG.cta. Server-safe: no hooks.

import React from "react";
import Link from "next/link";

import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import { PolarisStar } from "@/components/custom/landing/polaris-star";
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
    <section id={id} className="px-sky w-full py-6 md:py-10">
      <div className="container mx-auto max-w-6xl px-4 xl:px-0">
        <div className="px-band relative overflow-hidden rounded-[1.75rem] px-6 py-12 md:px-14 md:py-16">
          <PolarisStar
            size={260}
            className="pointer-events-none absolute -right-16 -top-20 opacity-[0.12]"
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <h2 className="px-display text-4xl !text-[var(--px-gold-ink)] md:text-5xl">
                {copy.heading}
              </h2>
              <p className="text-lg font-medium opacity-80">{copy.blurb}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={signupUrl} className="px-btn px-btn-ink">
                {copy.primary}
              </Link>
              <Link href={loginUrl} className="px-btn px-btn-ink-ghost">
                {copy.secondary}
              </Link>
            </div>
          </div>
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
