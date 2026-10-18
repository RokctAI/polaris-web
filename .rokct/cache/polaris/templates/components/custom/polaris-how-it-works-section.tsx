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


// "How it works" on the Polaris web app's landing, for base_sdk's
// page-sections registry: the four steps of the borrower's journey, the same
// steps the apply flow walks (polaris/docs/web-app.md section 4). Colours
// route through the shell's theme tokens.

import React from "react";

import type { PageSectionMeta } from "@/components/custom/landing/page-sections";

const STEPS = [
  {
    title: "Tell us about your money",
    text: "Your income after tax, what you spend each month and what you already repay. We check what you can afford before you go further.",
  },
  {
    title: "Tell us who you are",
    text: "Your ID number and a phone number we can reach you on.",
  },
  {
    title: "Upload your documents",
    text: "A photo of your ID and your bank statement as the PDF from your bank's app or email. Photos and scans of statements can't be checked.",
  },
  {
    title: "Accept your contract",
    text: "Once we approve, read your contract in the browser and accept or decline it. Follow your loan from the same page.",
  },
];

export function PolarisHowItWorksSection({ id }: { id?: string }) {
  return (
    <section id={id} className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto flex max-w-6xl flex-col gap-12 px-4 xl:px-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            How it works
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Everything happens in your browser, on your phone or your computer.
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-6">
              <span className="text-sm font-semibold text-primary">Step {i + 1}</span>
              <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export const meta: PageSectionMeta = {
  order: 40,
  nav: [{ id: "how-it-works", label: "How it works" }],
};

export default PolarisHowItWorksSection;
