# Changelog

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
