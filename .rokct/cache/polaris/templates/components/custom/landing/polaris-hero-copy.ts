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


// v3: `headlineWords` is empty on purpose. base's hero frame draws its
// rotating h1 only when there is a word to rotate, so with none it draws no
// headline and the registered hero form (polaris-hero-form.tsx) owns the
// whole hero: the static headline, the call to action and the product on
// screen beside it. The four words are still the page's - the form reads
// them, as one sentence, above the headline.
//
// The Polaris web app's hero copy, for base_sdk's hero-copy registry
// (components/custom/landing/hero-copy.ts). The hero frame renders
// "<text> <suffix>": the rotating text is what the loan is for, the suffix
// the one promise the page keeps - the full cost is on the page before the
// application starts (the calculator under the headline). No rate, amount
// or approval time is claimed; the calculator shows the Act's ceilings and
// says so. The trust line is drawn by polaris-hero-form.tsx under the
// calculator (the frame draws it only beside store badges, and a lender
// has none). `brand` stays "name": the host's Branding is the brand row,
// restyled by polaris-theme.css into the lime eyebrow.

import type { HeroCopy } from "@/components/custom/landing/hero-copy";

import { POLARIS_LANDING_CONFIG } from "./polaris-landing-config";

const POLARIS_HERO_COPY: HeroCopy = {
  headlineWords: [],
  headlineSuffix: POLARIS_LANDING_CONFIG.hero.suffix,
  wordIntervalMs: 3200,
  placeholders: [],
  backgroundImage: "",
  logo: "none",
  trustLine: [...POLARIS_LANDING_CONFIG.hero.trust],
  badges: [],
};

export default POLARIS_HERO_COPY;
