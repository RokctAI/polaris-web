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

export interface PolarisStoreLink {
  /** Stable key; also picks the badge's glyph. */
  id: "android" | "huawei" | "app-store";
  /** The small line over the platform's name. */
  eyebrow: string;
  label: string;
  /** Where the badge goes. An empty href draws no badge. */
  href: string;
  /** Off keeps the slot in the config without drawing it. */
  enabled: boolean;
  /**
   * The download route's platform this badge needs in the latest release
   * (app/download/[platform]/resolve.ts). Set: the badge is drawn only
   * when the release really carries that build. Absent: no release check.
   */
  release?: "android" | "huawei";
}

/** Which mobile builds the latest release carries (resolve.ts's DownloadAvailability). */
export type PolarisAppAvailability = Partial<Record<"android" | "huawei", boolean>>;

/**
 * The badges to draw: enabled, with somewhere to go, and - for a badge tied
 * to a release build - only when the latest release carries it. With no
 * answer about the release (null: not checked yet, or the fetch failed)
 * every release-tied badge stays hidden.
 */
export function polarisShownStores(
  stores: readonly PolarisStoreLink[],
  available: PolarisAppAvailability | null,
): PolarisStoreLink[] {
  return stores.filter((store) => {
    if (!store.enabled || store.href.trim().length === 0) return false;
    if (!store.release) return true;
    return available?.[store.release] === true;
  });
}

export const POLARIS_LANDING_CONFIG = {
  hero: {
    /** The rotating part of the headline: what the credit is for. */
    words: [
      "Credit for the rent",
      "Credit for the car",
      "Credit for a tight month",
      "Credit for the unexpected",
    ],
    /** The rest of the sentence, after the rotating part. */
    suffix: "with the full cost shown before you apply.",
    /**
     * v3: the hero's static headline - the promise of the suffix, set as
     * the page's one big line - and the line above it naming what the loan
     * is for, the four rotating words read as one sentence.
     */
    headline: { lead: "The full cost,", accent: "shown before", tail: "you apply." },
    kicker: "Polaris lends for the rent, the car, a tight month or the unexpected",
    lede: "Credit should be a number you can see, not a surprise on a statement. Apply, upload, sign and follow your loan from your phone or your computer.",
    primary: "Apply now",
    secondary: "How it works",
    trust: [
      "Priced under the National Credit Act",
      "Apply in your browser or the app",
      "Your contract, signed in the browser",
    ],
    /** What happens after the button: the screen says what comes next. */
    next: "Create an account, then tell us about your money. Your offer is written after that, and it can only sit below the figures above.",
  },

  why: {
    eyebrow: "Why Polaris",
    heading: "Lending, with the lights on.",
    blurb:
      "Credit should be a number you can see, not a surprise on a statement. Polaris puts every rand of the cost in front of you first, then reads your own bank statement to decide what you can afford.",
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
    /** The one picture of this screen: a month as the statement reader sees it. */
    month: {
      caption: "An example month, as we read it from a statement",
      income: 20000,
      living: 5000,
      debts: 1500,
      loan: 3706.4,
      verdict: "Fits, with R9 793,60 to spare",
    },
    next: "The four steps of the application, and what each one asks of you.",
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
    /** When each step is done with, in the borrower's terms. */
    when: ["About two minutes", "One minute", "Two uploads", "When we have decided"],
    next: "After the fourth step you ask for your payout from your loan's page, and the money follows.",
  },

  costs: {
    eyebrow: "What it costs",
    heading: "What short-term credit can cost, by law.",
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
    next: "Your offer prints every one of these lines with its rand figure before you sign anything.",
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
    /** What happens next, in order, once the button is pressed. */
    steps: [
      { when: "Now", text: "Create an account with your phone number." },
      { when: "About two minutes", text: "Tell us about your money and who you are." },
      { when: "Two uploads", text: "A photo of your ID and your bank statement as a PDF." },
      { when: "Then", text: "Your offer, and your contract, on the page." },
    ],
  },

  /**
   * The mobile app (Ray, 2026-10-31: "add link to download mobile app").
   * The browser stays the whole product; the app is the other door, so the
   * badges sit under the calls to action, in the close and in the footer.
   * The app has no Play listing, so the badges are the site's own download
   * route (Ray, 2026-10-31: "do what you did with supacharge-web"):
   * /download/<platform> resolves the latest RokctAI/polaris release's
   * build and redirects to it. Mobile only (Ray: "polaris wont have the web
   * app downloadable only the mobile platforms"). Android and Huawei are
   * drawn only when the latest release carries that build (Ray: the Huawei
   * badge shows only when there is a real Huawei build; the same rule for
   * Android). The wording names the platform, never a file format. The
   * polaris app has no iOS target and no App Store listing yet, so that
   * slot is kept here, disabled, until one exists.
   */
  app: {
    label: "Get the app",
    stores: [
      {
        id: "android",
        eyebrow: "Download for",
        label: "Android",
        href: "/download/android",
        enabled: true,
        release: "android",
      },
      {
        id: "huawei",
        eyebrow: "Download for",
        label: "Huawei",
        href: "/download/huawei",
        enabled: true,
        release: "huawei",
      },
      {
        id: "app-store",
        eyebrow: "Download on the",
        label: "App Store",
        href: "",
        enabled: false,
      },
    ] satisfies PolarisStoreLink[],
  },

  footer: {
    links: [
      { label: "What it costs", href: "#costs" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Why Polaris", href: "#why" },
      { label: "Questions", href: "#faq" },
      { label: "About", href: "/about" },
    ],
  },
} as const;

export type PolarisLandingConfig = typeof POLARIS_LANDING_CONFIG;
