# Changelog

## 1.7.0

The landing is Polaris's own, with a loan calculator (Ray, 2026-10-18:
"redesign this landing page. the site is polaris not polaris-web. make it
look good and give it a loan calculator"; and the rule that every Next.js
site is built to a portfolio standard with an identity of its own, not the
platform's frame with new words). `app_type.polaris` only; the back office
and the borrower area are untouched.

* **A look of its own.** `landing/polaris-theme.css`, scoped to the
  `px-landing` class the new theme section (order -2, `rootClass`,
  `frame`) puts on the landing root and `landing/polaris-theme.tsx` puts on
  `<html>`: the navy and gold of Polaris's decision notices as page tokens,
  a warm-paper light set, dark by default without overriding the header's
  toggle. The shadcn tokens are redefined inside the scope, so base_sdk's
  header and primitives wear the palette untouched. Two faces through
  `next/font/google` (`landing/polaris-fonts.ts`): Fraunces for display
  and figures, Manrope for text. The hero frame is re-set from outside
  (sky, eyebrow brand row, serif headline, gold italic rotating word), and
  base's wordmark reads "Polaris" with a star before it.
* **The hero is the calculator.** `landing/polaris-hero-form.tsx` draws
  `landing/polaris-loan-calculator.tsx`: an amount (typed or slid, R500 to
  R8 000), a term (one to six months), credit life cover on or off, and the
  most that loan can cost under the National Credit Act - the total, the
  instalment, every line of the cost and the s103(5) bar (cost of credit
  against the amount, the ceiling the Act sets). The maths is
  `landing/polaris-loan-presets.ts` over the SDK's own
  `app/lib/lending/ncr_calculator.ts` at the Act's caps (5% a month, R165 +
  10% over R1 000 capped at R1 050, R60 a month, 15% VAT on the fees, R4,50
  per R1 000 cover), labelled as an indication, not an offer. Apply goes to
  sign-up with the amount in the button.
* **Six sections** (`components/custom/polaris-*-section.tsx`): why (an
  editorial spread, four numbered reasons), how it works (the four apply
  steps on a gold line), what it costs (the Act's ceilings as a price list,
  ending on s103(5) in a gold band), questions (`.client` half holds the
  open item; CSS reveal, no motion library), a closing gold band, and the
  footer (wordmark, motto, links, base's `FooterChromeRow` with the Legal
  link group from `listPublicTerms()`; `frame: true`, so /about, /team and
  /legal end the same way). The header menu anchors why, how-it-works,
  costs and faq and links About.
* **The name.** `landing/polaris-brand.ts`: the shell's `PLATFORM_NAME`
  unless it is still the app_type (`polaris`, `polaris-web`), then
  "Polaris". Site metadata, the footer wordmark and the title read it.
* Copy lives in `landing/polaris-landing-config.ts` and claims no rate,
  amount, approval time or registration of the lender's own: the figures
  on the page are the law's.
* New `tests/test_manifest.py` (stdlib): every install exists, every
  registry entry is server-safe (the hero form apart), every section
  exports `meta`, every host import is in `requires`, the footer version
  matches the manifest.

## 1.6.0

The Polaris web app: polaris_sdk is the home SDK of the `polaris` Next.js
template, so a lender's site gets its landing, its back office and a
borrower area from this SDK (`docs/web-app.md`). Needs Polaris frappe 1.2.0.

* **Home and landing** (`app_type.polaris`, installed only in the polaris
  shell): `app/page.tsx` sends signed-out visitors to base_sdk's `/landing`,
  lending staff to `/handson/all/lending` and everyone else to `/loans`,
  decided by `api.lending.get_my_lending_access`. The landing gets Polaris
  hero copy, an Apply now / How it works hero, a how-it-works section, a
  one-anchor header menu, site metadata named after the shell and no plans
  section.
* **Borrower area**, what the Dart app does, in the browser: `/loans` (the
  open loan, drafts to continue, applications), `/loans/apply` (amount and
  income, details, consent, then documents; affordability is checked before
  sending and a declined offer is recorded), `/loans/[id]` (status, the
  contract to accept or decline, payout request, cancel, documents). Uploads
  go through `POST /api/lending/documents` (4 MB cap; a bank statement must
  be a real PDF, checked by its first bytes).
* **The back office runs in a fresh shell.** Its pages used to import the
  old host app's role helper, base service, currency action, NCR
  calculator, reports config and erp lookups. Those now ship in this SDK
  (`app/actions/handson/all/lending/{access,currency,lookups}.ts`,
  `app/services/all/lending/{access,base}.ts`, `app/lib/lending/`), and
  staff and licence checks come from the backend, not session roles.
* Fixed back-office pages that did not compile on Next.js 16: route params
  are read with `use()`, the search-param pages render inside `Suspense`,
  and wrong types on adjustments, new application, Form 20, Form 40,
  Section 129, transfer and operations were corrected.

## 1.5.0

* Staff see what the client did with the contract. The application page has
  a Contract card (the client's answer, when they answered, and when they
  asked for the payout), and the applications list marks approved
  applications "contract accepted", "contract declined" or "contract
  waiting", plus "payout requested". These come from `contract_status`,
  `contract_responded_on` and `payout_requested_on`, which the Polaris app's
  `accept_loan_contract`, `decline_loan_contract` and `request_payout` cmds
  write; the web app never showed them before.

## 1.4.0

* Statements panel on the application page (stored statements, per-line
  income overrides with a reason, re-read, paste text) and a PDF-only picker
  for bank statements. See the backend CHANGELOG (Polaris frappe 1.1.0).
