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


// The Polaris web app's hero copy, for base_sdk's hero-copy registry
// (components/custom/landing/hero-copy.ts). The hero frame renders
// "<text> <verb> <suffix>"; the suffix carries the point Ray made for this
// app (2026-10-17): a borrower does it all in the browser, with no app to
// download. Every line says only what the product does; no rate, amount or
// approval time is fixed in any source, so none is claimed. No input on this
// hero (polaris-hero-form.tsx draws two calls to action) and no store badges.

import type { HeroCopy } from "@/components/custom/landing/hero-copy";

const POLARIS_HERO_COPY: HeroCopy = {
  headlineWords: [
    { text: "Apply for a loan", verb: "" },
    { text: "Send your bank statement", verb: "" },
    { text: "Accept your contract", verb: "" },
  ],
  headlineSuffix: "from your browser",
  placeholders: [],
  backgroundImage: "",
  trustLine: ["No app to download", "Your statement as the PDF from your bank"],
  badges: [],
};

export default POLARIS_HERO_COPY;
