# Changelog

## 1.9.1

* **A hero that fits the first screen.** Ray, 2026-10-31, on the 1440
  dark render: "too much gap" and "hero too tall but atleast this part need
  to be visible. the gap above doesnt help it". The header is sticky and
  sits directly on the hero, so the gap was the hero's own 9rem top padding
  plus the copy column centred against a stage made 12rem taller by the
  loan's page hanging below the window. Now, in `landing/polaris-theme.css`:
  * `#hero` padding is 2.5rem top and bottom from 768px (was 9rem and
    8rem), 2rem and 3rem on a phone (was 6.5rem and 5rem), and base's
    min-height is cleared.
  * The headline tops out at 5rem (was 6rem); the gaps between the kicker,
    headline, lede, calls to action, app badges and trust line are a
    quarter to a third shorter; the split's column gap is 3.5rem.
  * The stage's overhang for the loan's page is 8rem (was 12rem), and the
    hero's window is drawn a little tighter (body padding, row spacing, the
    step heading at 1.5rem, the timeline rows).
  * At 1440x900 the headline, both calls to action, the trust line and the
    whole product window with its bottom edge and the loan's page are on
    the first screen; on a 390x844 phone the headline and Apply now are.
  Design, copy, colours (lime main, brass pending only) and the window are
  unchanged.
* **Once-off repayment; the other months are locked.** Ray, 2026-10-31: the
  calculator "is allowing selection of multi months payments while we do
  once off i think it should lock other months". `polaris-loan-presets.ts`
  sets `defaultMonths` to 1 and adds `ONCE_OFF_MONTHS` and
  `isMonthOptionOpen()`. The calculator still draws the Act's one to six
  months, but only the one month is open: the others are disabled buttons
  with a small lock, muted, titled "Polaris repays once-off". The receipt
  reads "Once-off, in one repayment on <date>"; the multi-month instalment
  line is gone. The figures are the engine's for 30 days at the caps (the
  default R3 000: R150 interest, R365 initiation fee, R58,06 service fee,
  R63,46 VAT, R3 636,52 in total, R636,52 cost of credit); every ceiling
  and the s103(5) bar are unchanged.
* The month bar's example loan (the hero's step one and "Why") is that
  once-off repayment, R3 636,52, leaving R9 863,48 (was a hand-typed
  R3 706,40 and R9 793,60).
* **A shorter "What it costs".** Ray: "this is also too tall". The section
  (`.px-section-costs`) has 5rem padding from 768px (was 7.5rem), a 2.5rem
  run-in under the head (was 4.5rem), the ceilings row and the s103(5) line
  nearer the calculator, and the calculator's paddings and gaps tighter;
  its two fine-print paragraphs are one.
* `POLARIS_LANDING_VERSION` goes to 1.9.1. Tests: `OnceOffRepayment` in
  `tests/test_manifest.py`.

## 1.9.0

* **Polaris' own Back to top button.** Ray, 2026-10-31: the button must
  not look the same on every site; base_sdk supplies only the mechanism
  and each home SDK sets its own style. New
  `components/custom/landing/polaris-back-to-top.ts` registers a
  `BackToTopConfig` at base_sdk 1.56.0's
  `// @rokct-sdk-back-to-top-style-start` marker, so the landing's framed
  button and the root button on every other route read it.
* The style is Polaris' call-to-action pill (`.px-btn-lime`): fully
  rounded, `--px-lime` fill with `--px-lime-ink` text, `--px-lime-hover`
  on hover, the label "Top" in `--px-font-sans` (Manrope) 700 with
  -0.01em tracking beside Remixicon's chevron, no border, the soft lime
  glow beneath and the quick 150ms ease. Outside `.px-landing` each value
  falls back to base's shadcn token.
* The polaris block's `requires` gains `back-to-top-style.ts` and
  `back-to-top.ts` (base_sdk >= 1.56.0). `POLARIS_LANDING_VERSION` goes to
  1.9.0.

## 1.8.1

* **Fonts are bundled; the build no longer fetches Google Fonts.** The four
  landing faces load through `next/font/local` from
  `landing/fonts/polaris/` instead of `next/font/google`. polaris-web main
  a9fd8c3 failed in Actions, and supacharge-web main 6449cbd failed twice on
  Vercel, with `next/font/google queries have exactly one entry` for Inter:
  Google answered with `fonts.gstatic.com/l/font?kit=...` URLs, which
  Turbopack's `next/font/google` loader cannot resolve.
  * Fraunces (300 to 700, upright and italic), Manrope (400 to 800) and
    Inter (400 to 700) are the google/fonts sources (the versions Google
    serves) cut to the latin and latin-ext characters, with the other axes
    pinned where Google pins them; they draw the same glyphs. Cyrillic,
    greek and vietnamese text, which Google's extra faces covered, now
    draws in the fallback.
  * IBM Plex Mono 400 and 500 ship whole (the TTFs as woff2): "Plex" is a
    Reserved Font Name, so the files are not subset.
  * `OFL.txt` (SIL Open Font License 1.1) sits beside the fonts.
  * `polaris-fonts.ts` keeps its four exports, the `--px-font-*`
    variables, `display: swap` and the metric-matched fallbacks (Times New
    Roman for Fraunces, Arial for the rest), so the landing looks the same.
    `POLARIS_LANDING_VERSION` goes to 1.8.1. No base_sdk floor moves.

## 1.8.0

* **Footer credit.** Ray, 2026-10-31: "all site will be copyright sitename
  then built with love (as heart) by ROKCT." The footer row now reads
  "© <year> Polaris · Built with ♥ by ROKCT": `polaris-footer-chrome.ts`
  passes `siteName: POLARIS_BRAND_NAME` instead of the legal entity as
  `copyrightHolder`. Needs base_sdk 1.54.0 (core#365, SiteCredit).
* **v3 landing: a new layout, not a recolour.** Ray, 2026-10-31, after v2
  "still reads as the old site". The colours stay the v2 tokens (lime for
  the brand, brass for pending only); the page is rebuilt:
  * The hero is a split. The hero copy registers no rotating words, so
    base's frame draws no h1 and `landing/polaris-hero-form.tsx` owns the
    hero: a static headline from the existing promise ("The full cost,
    shown before you apply."), the uses as one line above it, Apply now and
    How it works, the three trust facts, and on the right step one of the
    application in a browser window with the loan's page laid over it (the
    one brass mark is its "In review" row; the DebiCheck line is the app's
    own wording).
  * New `landing/polaris-product-ui.tsx` draws the borrower's screens in
    the app's v2 language and face (Inter): the month bar, the application
    step, the loan timeline, and one picture per step of "How it works".
  * New `landing/polaris-section-head.tsx`: every section opens with a
    rule, a mono index (IBM Plex Mono) and a display heading.
  * The calculator moves out of the hero into "What it costs", at full
    width in a window frame; the Act's ceilings become a ruled row and the
    s103(5) cap the closing line. Page order is now costs, how it works,
    why, questions; the header anchors and footer links follow.
  * "Why" sets "Lending, with the lights on." as a mega line over four
    columns; every FAQ answer is open in two columns; the close is one
    dark panel in both modes; the footer sets the name across the width.
  * No new claims, figures or partners: every word comes from the existing
    copy or the app's own labels.
* **Get the app.** Ray, 2026-10-31: "add link to download mobile app". New
  `landing/polaris-store-badges.tsx` draws house-style app badges (inline
  SVG, not any store's artwork) in the hero under the calls to action, in
  the close and in the footer. The links are data in
  `POLARIS_LANDING_CONFIG.app.stores`.
* **The app downloads from the site, as on Supacharge.** The Polaris app has
  no Google Play listing (the `com.loans.app` Play URL is a 404), so Ray
  ruled "do what you did with supacharge-web":
  * New `app/download/[platform]/route.ts` + pure `resolve.ts`, lms_sdk's
    route ported: `GET /download/<platform>` asks the public GitHub
    releases API for the latest `RokctAI/polaris` release (no token,
    `revalidate` 600, in the new shared `app/download/release.ts`) and
    302s to the platform's asset. Android is `app-v<version>.apk`, never
    `app-debug-v*.apk`, the `.aab` or the Huawei build; with no such asset
    or no API answer it 302s to the releases page. A prefetch gets 204.
  * Mobile only (Ray: "polaris wont have the web app downloadable only the
    mobile platforms"): the Windows installer the release also carries is
    never offered, and `/download/<anything else>` (ios, windows, ...) is a
    404.
  * Huawei (Ray, 2026-10-31): `/download/huawei` resolves
    `app-huawei-v<version>.apk` from the same release and answers 404 when
    there is none - never the Android build.
  * The badges read "Download for / Android" and "Download for / Huawei"
    with Simple Icons' Android and Huawei marks (CC0-1.0, in currentColor)
    and link `/download/android` and `/download/huawei`; no file format is
    named. Each is drawn only when the latest release carries its build: the
    close and the footer await the server's release check, and the hero
    (base renders it on the client) reads the same check from the new
    `GET /download` (`app/download/route.ts`, `{android, huawei}`). A failed
    fetch hides every badge. The App Store slot stays, disabled. The Google
    Play URL and wording are gone. v3's badge look and spacing are kept.
  * Manifest: the four `app/download` files join the polaris install map.
  * Tests: new `tests/test_download_route.py` runs the resolver and the
    badge filter under node against fixture release JSON (the real v1.2.12
    asset list, with and without a Huawei build, broken and failed
    answers), checks the handler's 302/404/204 and cache, and keeps "apk"
    out of every rendered string.
* **A shorter calculator.** Ray, 2026-10-31: the calculator section was
  too tall (in v1 and v2 too); the receipt set the height and left about
  250px of empty space under the controls. The cost of credit, its bar and
  its section 103(5) line move under the controls, each half's fine print
  follows its own content, and the paddings, the gaps and the headline
  total are tighter: the panel is 669px at 1440 wide instead of 828px.
  Every word and figure is unchanged.
* **Lending, not cash loans.** Ray, 2026-10-31: Polaris should read as a
  lending institution on its way up, never as another cash loan. The brand
  lines say lending and credit: the metadata title and tagline ("Lending
  with the full cost shown first"), the hero kicker ("Polaris lends for
  ..."), the hero and "Why" ledes ("Credit should be a number you can
  see ..."), the costs heading ("What short-term credit can cost, by
  law.") and the footer motto ("Your north star for credit."). "Loan"
  stays on the working parts (buttons, calculator, steps, "Your loan"), and
  the Act's wording, figures and the DebiCheck line are untouched. A test
  keeps cash-loan vocabulary (quick cash, instant, payday) out of the copy.
* `POLARIS_LANDING_VERSION` follows the manifest to 1.8.0.

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
