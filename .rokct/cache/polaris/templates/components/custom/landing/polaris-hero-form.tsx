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
// (components/custom/landing/hero-form.ts).
//
// v3 (Ray, 2026-10-31: v2 "still reads as the old site"): the hero is no
// longer a centred headline over the calculator. It is a split: on the left
// the page's one promise as a static headline, what the loan is for, the
// two doors and the three trust facts; on the right the product itself -
// step one of the application in a browser window and, laid over it, the
// loan's page with its timeline (brass on the one pending row). The
// calculator moves to its own section ("What it costs"), where it has the
// width to be a receipt. base draws no h1 of its own (the hero copy has no
// rotating words), so the h1 is here.
//
// The calls to action: Apply now goes to sign-up (a new borrower needs an
// account first, and /loans/apply follows the sign-in); How it works is the
// in-page anchor, drawn only when that section is on this render. Under
// them, the app badges for the mobile app (1.8.0), from the config. base
// renders this form on the client with no server data of its own, so the
// release check reaches it through GET /download (app/download/route.ts,
// the server's cached release fetch): the badges are drawn once that
// answers, and only for the builds the latest release carries; an error
// leaves them hidden.

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import type { HeroFormProps } from "@/components/custom/landing/hero-form";

import { POLARIS_LANDING_CONFIG } from "./polaris-landing-config";
import { IconCheck, UiApplicationStep, UiLoanStatus, UiWindow } from "./polaris-product-ui";
import type { PolarisAppAvailability } from "./polaris-landing-config";
import { PolarisStoreBadges } from "./polaris-store-badges";

/** Which builds the latest release carries, from the server; null until (or unless) it answers. */
function usePolarisAppAvailability(): PolarisAppAvailability | null {
  const [available, setAvailable] = useState<PolarisAppAvailability | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/download", { headers: { accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: unknown) => {
        if (!live || !body || typeof body !== "object") return;
        const answer = body as Record<string, unknown>;
        setAvailable({ android: answer.android === true, huawei: answer.huawei === true });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return available;
}

export default function PolarisHeroForm({ hero, signupUrl, nav }: HeroFormProps) {
  const copy = POLARIS_LANDING_CONFIG.hero;
  const howOnPage = !nav || nav.some((item) => item.id === "how-it-works");
  const available = usePolarisAppAvailability();
  return (
    <div className="px-hero">
      <div className="px-hero-copy">
        <p className="px-kicker">
          <span aria-hidden="true" className="px-kicker-dot" />
          {copy.kicker}
        </p>
        <h1 className="px-h1">
          {copy.headline.lead} <em>{copy.headline.accent}</em> {copy.headline.tail}
        </h1>
        <p className="px-hero-lede">{copy.lede}</p>
        <div className="px-hero-ctas">
          <Link href={signupUrl} className="px-btn px-btn-lime px-btn-lg">
            {copy.primary}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          {howOnPage && (
            <a href="#how-it-works" className="px-btn px-btn-ghost px-btn-lg">
              {copy.secondary}
            </a>
          )}
        </div>
        <PolarisStoreBadges available={available} className="px-hero-stores" />
        {hero.trustLine.length > 0 && (
          <ul className="px-trust">
            {hero.trustLine.map((claim) => (
              <li key={claim}>
                <span aria-hidden="true" className="px-trust-mark">
                  <IconCheck size={12} stroke={3} />
                </span>
                {claim}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-hero-stage" aria-label="The application, as it looks in your browser" role="img">
        <div className="px-hero-glow" aria-hidden="true" />
        <UiWindow path="/loans/apply" className="px-hero-window">
          <UiApplicationStep />
        </UiWindow>
        <UiLoanStatus className="px-hero-status" />
      </div>
    </div>
  );
}
