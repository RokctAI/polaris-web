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
// (components/custom/landing/hero-form.ts): two calls to action and no
// input, as hosting-hero-form.tsx. "Apply now" goes to sign-up (a new
// borrower needs an account first; /loans/apply follows the sign-in), the
// second scrolls to how it works when that section is on the page.

"use client";

import React from "react";
import Link from "next/link";

import type { HeroFormProps } from "@/components/custom/landing/hero-form";

const HOW_IT_WORKS = "how-it-works";

export default function PolarisHeroForm({ hero, signupUrl, nav }: HeroFormProps) {
  const showHow = !nav || nav.some((item) => item.id === HOW_IT_WORKS);
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
        <Link
          href={signupUrl}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
        >
          Apply now
        </Link>
        {showHow && (
          <a
            href={`#${HOW_IT_WORKS}`}
            className="inline-flex w-full items-center justify-center rounded-full border border-border px-8 py-3 text-base font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
          >
            How it works
          </a>
        )}
      </div>

      {hero.trustLine.length > 0 && (
        <p className="text-sm font-medium text-muted-foreground">{hero.trustLine.join(" · ")}</p>
      )}
    </div>
  );
}
