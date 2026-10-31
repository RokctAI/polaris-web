# Changelog

## 1.7.3

* **v2 landing.** The public landing is brought up to the app's v2
  standard: the hero calculator becomes a receipt (tabular, right-aligned
  rand lines, the total as one number, instalment dates written out in
  full, one lime button); "why" is a month bar, "how" a timeline, "costs"
  the receipt with the legal ceiling, and the close lists what happens
  next. Every section ends with a "Next" row. Dark mode alternates deep
  and lighter pine bands with stroked cards; light mode uses linen bands
  with white cards. All existing copy is kept; the DebiCheck wording is
  untouched.

## 1.7.2

* **Lime and brass replace ember.** Ray, 2026-10-30, after ember read as
  overused: lime for the brand, brass for pending. In
  `landing/polaris-theme.css` the `--px-ember*` tokens become `--px-lime*`
  (`#B8E05A`, ink `#13200A` on lime fills) and `.px-btn-ember` becomes
  `.px-btn-lime`; the sections that read them follow. Light mode keeps the
  lime fill and uses `#4E7A12` for lime text. New `--px-brass*` tokens
  (`#E3AE45`, ink `#1D1405`, light-mode text `#8F6410`) mark pending
  states: the footer's maintenance status. Lime is also the "good" colour,
  so `--px-green` is gone and the operational status reads lime. The
  shadcn HSL set follows (`--primary: 78 68% 62%`, foreground
  `95 52% 8%`; light `--ring` is the lime text shade). Layout and copy are
  unchanged.

## 1.7.1

Three corrections to the 1.7.0 landing, all Ray's on 2026-10-18, `app_type.polaris` only:

* **New brand colours: pine and ember.** "pick new branding colors for
  polaris". The navy-and-gold set read as the platform's yellow; the
  landing is now a deep pine-green sky, cool off-white ink and one ember
  (a warm coral-orange) for the eyebrows, the figures, the calculator's
  controls and the sign-up band, with a pale mint-linen light set. The
  tokens are renamed with the colour (`--px-gold*` is `--px-ember*`,
  `.px-btn-gold` is `.px-btn-ember`) in `landing/polaris-theme.css` and
  the sections that read them; the shadcn HSL set inside the scope follows
  (`--primary: 12 100% 67%` dark, `14 77% 54%` light). The status red is
  a pink-red so it is not the accent. Fonts, layout and the calculator
  are as in 1.7.0.
* **No star.** "polaris no star please i made you remove it before".
  `landing/polaris-star.tsx` is gone with its four-point mark: the header
  wordmark, the hero eyebrow, the section eyebrows, the why cards, the
  costs band, the sign-up band, the trust line and the footer carry no
  mark (eyebrows get a short rule, the trust line a dot, the footer the
  name in the display face), and the starfield texture behind the costs
  section is gone too.
* **"A loan for the rent".** "loan for school fees? thats connecting it
  to supacharge". The first rotating hero word is the rent, not school
  fees (`landing/polaris-landing-config.ts`).

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
