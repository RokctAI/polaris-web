# polaris-web — accepted brief

> Copied verbatim from https://github.com/RokctAI/factory/issues/39 at spawn time. Do not edit: this is the
> record of what was accepted. Decisions taken while building belong in
> `.rokct/decision_log.md`.

**One line:** A lender's website on Next.js: a landing page for visitors, the lending back office for staff and the borrower area in the browser.

## Rationale

**Who it is for:** a registered credit provider running Polaris, and their borrowers. Ray, 2026-10-17: a Next.js frontend for Polaris like supacharge-web, landing from the home SDK. Staff do their work when signed in as staff, and customers do in the browser what they do in the Dart app, because a borrower cannot be made to install an app on a desktop.

**What this repo is: a public Next.js app shell.** It holds no feature code, only the composable shell the `nextjs` overlay seeds plus the composition inputs. The SDK list is the Protocol template `core/utils/nextjs/composer/polaris.json` (RokctAI/The-Rokct-Protocol#489, merged): telemetry_sdk, base_sdk, auth_sdk, corporate_sdk and polaris_sdk as the home SDK. It has no agent_sdk and no erp_sdk.

**One edit after the spawn:** the overlay writes `.rokct/config/app_type` = `polaris-web` (the repo slug). Change that one line to `polaris`, the same way `supacharge-web` reads `supacharge`, then run one `scripts/compose.sh refresh` and commit `.rokct/lock.json`. Two things key on that word: the template name, and polaris_sdk's `app_type.polaris` block, which installs the home page and landing modules. With `polaris-web` the composer finds no template and composes nothing.

**What the composed site does** (polaris_sdk nextjs 1.6.0, RokctAI/corporate#119):
- `/` sends visitors to the landing, lending staff to `/handson/all/lending` and everyone else to `/loans`. It decides from the backend cmd `api.lending.get_my_lending_access`.
- The landing has Polaris hero copy, an Apply now and How it works hero, a how-it-works section and no plans section.
- `/loans`, `/loans/apply` and `/loans/[id]` are the borrower area: apply, upload documents (bank statement as the bank's PDF only, 4 MB cap), accept or decline the contract, ask for the payout, cancel.
- `/handson/all/lending/**` is the back office: applications, loans, repayments, products, reports (NCR Form 40, Form 20, Section 129), operations.
- `/portal/loan-quote/[token]` is the public quote page.

The contract for all of it is `corporate/polaris/docs/web-app.md`.

**Backend:** the lender's site with the Polaris Frappe module (`core/utils/frappe/composer/polaris.json`), the same one the `polaris` Flutter app uses. Known gap: that template composes no `erp` module, yet Company and Customer exist only there, so the backend cannot hold an application yet. This waits on Ray's decision about where Polaris runs.

**Fleet rules this must satisfy:** no backend, Frappe, fixture or SDK code in this repo, only the one-line app_type marker and shell code. Pages come only through SDK install; a change to a page goes to `corporate/polaris/nextjs`. Contract-first: new cmds are written into `web-app.md` before code. Client statements are personal data: synthetic fixtures only.

**Done for v0:** app_type reads `polaris`, compose is green and `next build` passes (the same composition already typechecks with 0 errors and builds on the SDK side). Deploy on Vercel against a Polaris backend. A visitor sees the landing; a borrower can register, apply and upload a statement PDF; a Loan Manager signs in and lands in the back office.
