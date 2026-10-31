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


// The Polaris web app's hero body, for base_sdk's hero-form registry
// (components/custom/landing/hero-form.ts): the loan calculator itself
// (Ray, 2026-10-18: "give it a loan calculator"), and under it the trust
// line the hero copy declares, which the frame would otherwise draw only
// beside store badges. The calculator's own call to action goes to sign-up:
// a new borrower needs an account first, and /loans/apply follows the
// sign-in.

"use client";

import React from "react";

import type { HeroFormProps } from "@/components/custom/landing/hero-form";

import { PolarisLoanCalculator } from "./polaris-loan-calculator";
import { POLARIS_LANDING_CONFIG } from "./polaris-landing-config";

export default function PolarisHeroForm({ hero, signupUrl }: HeroFormProps) {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <PolarisLoanCalculator signupUrl={signupUrl} />
      {hero.trustLine.length > 0 && (
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-[var(--px-sec)]">
          {hero.trustLine.map((claim) => (
            <li key={claim} className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--px-sec)]"
              />
              {claim}
            </li>
          ))}
        </ul>
      )}
      <div className="px-next w-full max-w-5xl text-left">
        <b>Next</b>
        <span>{POLARIS_LANDING_CONFIG.hero.next}</span>
      </div>
    </div>
  );
}
