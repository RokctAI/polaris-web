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


// Every word the Polaris landing says, in one place. The rule the copy
// keeps (polaris/docs/web-app.md, section 5): say what the product does
// and what the law fixes; claim no rate, amount, approval time or
// registration of the lender's own. The figures in `costs` are the
// National Credit Act's ceilings, which are public.

export interface PolarisFaqItem {
  question: string;
  answer: string;
}

export interface PolarisCostRow {
  label: string;
  value: string;
  note: string;
}

export const POLARIS_LANDING_CONFIG = {
  hero: {
    /** The rotating part of the headline: what the loan is for. */
    words: [
      "A loan for the rent",
      "A loan for the car",
      "A loan for a tight month",
      "A loan for the unexpected",
    ],
    /** The rest of the sentence, after the rotating part. */
    suffix: "with the full cost shown before you apply.",
    trust: [
      "Priced under the National Credit Act",
      "No app to download",
      "Your contract, signed in the browser",
    ],
  },

  why: {
    eyebrow: "Why Polaris",
    heading: "Lending, with the lights on.",
    blurb:
      "A loan should be a number you can see, not a surprise on a statement. Polaris puts every rand of the cost in front of you first, then reads your own bank statement to decide what you can afford.",
    items: [
      {
        title: "Every rand, itemised",
        text: "Interest, the initiation fee, the monthly service fee and the VAT on them are listed before you sign, each one under the ceiling the National Credit Act sets.",
      },
      {
        title: "A decision from your statement",
        text: "Send the PDF statement from your bank's app or email. We read your income and your commitments from it and check what you can afford before you go any further.",
      },
      {
        title: "The browser is the branch",
        text: "Apply, upload, sign and follow your loan from your phone or your computer. Nothing to install, no queue to stand in.",
      },
      {
        title: "Your contract, your call",
        text: "Once we approve, your contract is on the page to read. Accept it or decline it there, and ask for your payout from the same place.",
      },
    ],
  },

  how: {
    eyebrow: "How it works",
    heading: "Four steps, all of them in your browser.",
    steps: [
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
        text: "A photo of your ID and your bank statement as the PDF from your bank's app or email. Photos and scans of statements cannot be checked.",
      },
      {
        title: "Accept your contract",
        text: "Once we approve, read your contract on the page and accept or decline it. Follow your loan from the same page.",
      },
    ],
    note: "Stop at any step and your application waits for you; pick it up again from your loans page.",
  },

  costs: {
    eyebrow: "What it costs",
    heading: "What a short-term loan can cost, by law.",
    blurb:
      "The National Credit Act caps every part of a short-term loan: up to R8 000, repaid within six months. These are the ceilings. An offer from Polaris is written underneath them.",
    rows: [
      { label: "Interest", value: "5% a month", note: "at most, on the amount you borrow" },
      {
        label: "Initiation fee",
        value: "R165 + 10%",
        note: "of anything over R1 000, once, and never more than R1 050",
      },
      { label: "Service fee", value: "R60 a month", note: "at most" },
      { label: "VAT", value: "15%", note: "on the two fees, never on the interest" },
      {
        label: "Credit life cover",
        value: "R4,50 per R1 000",
        note: "a month, at most, and only when you take it",
      },
    ] satisfies PolarisCostRow[],
    cap: {
      label: "The ceiling on all of it",
      value: "The cost of credit can never be more than the amount you borrow.",
      note: "Section 103(5) of the National Credit Act.",
    },
    footnote:
      "Regulations 42, 44 and 106, and section 103(5), of the National Credit Act, 34 of 2005, as the calculator above applies them.",
  },

  faq: {
    eyebrow: "Questions",
    heading: "Asked before you apply.",
    items: [
      {
        question: "Who can apply?",
        answer:
          "Anyone with a South African ID, a bank account the statement comes from, and a regular income the statement shows. We check what you can afford before you go further, and we tell you the answer either way.",
      },
      {
        question: "What do I need to have ready?",
        answer:
          "Your ID number, a phone number we can reach you on, a photo of your ID, and your bank statement as the PDF your bank's app or internet banking gives you. That is all.",
      },
      {
        question: "Why a PDF and not a photo of my statement?",
        answer:
          "The PDF from your bank carries the lines we read: your income as it arrives and the commitments that leave. A photo or a scan cannot be checked that way, so it cannot be used.",
      },
      {
        question: "Is the calculator my offer?",
        answer:
          "No. It shows the most a loan of that size and term can cost under the National Credit Act. Your offer is written after we have checked your affordability, and it can only sit below those figures.",
      },
      {
        question: "Can I stop and carry on later?",
        answer:
          "Yes. Every step saves your application, and your loans page shows it waiting for you. Pick it up where you left it.",
      },
      {
        question: "What happens once I am approved?",
        answer:
          "Your contract appears on your loan's page. Read it, then accept it or decline it there. Once you accept, you ask for your payout from the same page and follow the loan from it.",
      },
    ] satisfies PolarisFaqItem[],
  },

  cta: {
    heading: "Ready when you are.",
    blurb: "Create an account, tell us about your money, and see your offer on the page.",
    primary: "Apply now",
    secondary: "Sign in",
  },

  footer: {
    links: [
      { label: "Why Polaris", href: "#why" },
      { label: "How it works", href: "#how-it-works" },
      { label: "What it costs", href: "#costs" },
      { label: "Questions", href: "#faq" },
      { label: "About", href: "/about" },
    ],
  },
} as const;

export type PolarisLandingConfig = typeof POLARIS_LANDING_CONFIG;
