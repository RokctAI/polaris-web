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


// v3: the product, drawn as product. Every picture on the landing is a
// piece of the borrower's own screens, in the Polaris app's v2 language
// (polaris-redesign/v2: the month bar, the timeline, the document tiles,
// the contract with its two buttons), so the site shows what a visitor will
// use instead of describing it. Every word on these screens is a label the
// app or the landing copy already uses; the figures are the landing's own
// example month (POLARIS_LANDING_CONFIG.why.month). Lime is "go" and "done";
// brass appears only on a pending state (the application being decided).
//
// Hook-free and import-light on purpose: the hero form (a client module)
// and the server sections both draw these.

import React from "react";

import { POLARIS_LANDING_CONFIG } from "./polaris-landing-config";
import { formatRand } from "./polaris-loan-presets";

/* ---------------------------------------------------------------- icons */

export function IconCheck({ size = 14, stroke = 2.6 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5l7 2.6v5.4c0 4.2-2.9 7.2-7 9-4.1-1.8-7-4.8-7-9V6.1z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M9 12l2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPlus({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconDoc({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3.5h7l4 4V20a.5.5 0 01-.5.5h-10A.5.5 0 017 20z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------------------------------------- frames */

/** A browser window: the borrower area as it opens on a computer. */
export function UiWindow({
  path,
  label,
  children,
  className = "",
}: {
  path: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-ui px-window ${className}`}>
      <div className="px-window-bar" aria-hidden="true">
        <span className="px-window-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="px-window-url">{path}</span>
        <span className="px-window-label">{label}</span>
      </div>
      <div className="px-window-body">{children}</div>
    </div>
  );
}

/** The six-segment step bar of the application, `on` segments filled. */
export function UiSteps({ total = 4, on = 1 }: { total?: number; on?: number }) {
  return (
    <div className="px-ui-steps" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < on ? "on" : undefined} />
      ))}
    </div>
  );
}

/* --------------------------------------------------------- the month bar */

/** The affordability picture: income as the whole bar, this loan drawn into it. */
export function UiMonth({ compact = false }: { compact?: boolean }) {
  const m = POLARIS_LANDING_CONFIG.why.month;
  const left = m.income - m.living - m.debts - m.loan;
  const pct = (v: number) => `${(v / m.income) * 100}%`;
  const money = (v: number) => formatRand(v, { cents: true });
  return (
    <div className={`px-ui-card px-ui-month ${compact ? "is-compact" : ""}`}>
      <div className="px-ui-k">Your month · income {money(m.income)}</div>
      <div className="bar" role="img" aria-label={m.verdict}>
        <i className="seg-exp" style={{ width: pct(m.living) }} />
        <i className="seg-debt" style={{ width: pct(m.debts) }} />
        <i className="seg-loan" style={{ width: pct(m.loan) }} />
        <i className="seg-left" style={{ width: pct(left) }} />
      </div>
      {!compact && (
        <div className="px-ui-legend">
          <div>
            <i className="seg-exp" />
            Living<b>{money(m.living)}</b>
          </div>
          <div>
            <i className="seg-debt" />
            Debts<b>{money(m.debts)}</b>
          </div>
          <div>
            <i className="seg-loan" />
            This loan<b>{money(m.loan)}</b>
          </div>
          <div>
            <i className="seg-left" />
            Left over<b>{money(left)}</b>
          </div>
        </div>
      )}
      <p className="px-ui-verdict">
        <IconCheck size={15} />
        {m.verdict}
      </p>
    </div>
  );
}

/* ------------------------------------------- the hero: step one on screen */

/** Step one of the application, as the borrower area draws it. */
export function UiApplicationStep() {
  const m = POLARIS_LANDING_CONFIG.why.month;
  const rows: [string, number][] = [
    ["Income after tax", m.income],
    ["Living costs", m.living],
    ["Other debt repayments", m.debts],
  ];
  return (
    <div className="px-ui-app">
      <div className="px-ui-apphead">
        <span className="px-ui-title">Loan application</span>
        <span className="px-ui-stepn">Step 1 of 4</span>
      </div>
      <UiSteps total={4} on={1} />
      <h3 className="px-ui-h">Does this loan fit your month?</h3>
      <p className="px-ui-sub">{POLARIS_LANDING_CONFIG.how.steps[0].text}</p>
      <UiMonth />
      <div className="px-ui-fields">
        {rows.map(([label, value]) => (
          <div key={label} className="px-ui-fld">
            <span>{label}</span>
            <b>
              <small>R</small>
              {formatRand(value, { cents: true }).slice(1)}
            </b>
          </div>
        ))}
      </div>
      <div className="px-ui-btn">Check affordability</div>
      <p className="px-ui-nca">
        <IconShield size={13} />
        <span>Priced under the National Credit Act</span>
      </p>
    </div>
  );
}

/* ---------------------------------------------- the loan, after applying */

type TlState = "done" | "pending" | "todo";

/** The loan's page: what has happened, what is being decided, what follows. */
export function UiLoanStatus({ className = "" }: { className?: string }) {
  const rows: { state: TlState; when: string; title: string; note?: string }[] = [
    { state: "done", when: "Today", title: "Application sent" },
    { state: "pending", when: "Now", title: "In review", note: "When we have decided, your offer is on this page." },
    { state: "todo", when: "Then", title: "Accept your contract" },
    { state: "todo", when: "Then", title: "Ask for your payout" },
    { state: "todo", when: "Due date", title: "Collected by DebiCheck", note: "By DebiCheck, from the account you choose at your bank." },
  ];
  return (
    <div className={`px-ui px-ui-card px-ui-status ${className}`}>
      <div className="px-ui-statushead">
        <span className="px-ui-title">Your loan</span>
        <span className="px-ui-pill is-pending">
          <i aria-hidden="true" />
          In review
        </span>
      </div>
      <ol className="px-ui-tl">
        {rows.map((row) => (
          <li key={row.title} data-state={row.state}>
            <i aria-hidden="true">{row.state === "done" ? <IconCheck size={11} stroke={3.2} /> : null}</i>
            <div>
              <span className="when">{row.when}</span>
              <b>{row.title}</b>
              {row.note && <small>{row.note}</small>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------- the four steps, one picture each */

/** Step two: who you are - the two things the application still needs. */
export function UiDetails() {
  return (
    <div className="px-ui-card px-ui-vignette">
      <div className="px-ui-fields is-stacked">
        <div className="px-ui-fld is-big">
          <span>South African ID number</span>
          <b className="is-mask">
            ●●●●●● ●●●● ●●●
          </b>
        </div>
        <div className="px-ui-fld is-big is-focus">
          <span>Mobile number</span>
          <b>
            0<i className="caret" aria-hidden="true" />
          </b>
        </div>
      </div>
    </div>
  );
}

/** Step three: the two uploads, one added and one waiting. */
export function UiDocuments() {
  return (
    <div className="px-ui-card px-ui-vignette">
      <div className="px-ui-tiles">
        <div className="px-ui-tile">
          <span className="thumb is-id" aria-hidden="true" />
          <span className="badge" aria-hidden="true">
            <IconCheck size={11} stroke={3.2} />
          </span>
          <b>Photo of your ID</b>
          <small>Added</small>
        </div>
        <div className="px-ui-tile is-todo">
          <span className="add" aria-hidden="true">
            <IconPlus />
          </span>
          <b>Bank statement</b>
          <small>The PDF from your bank</small>
        </div>
      </div>
    </div>
  );
}

/** Step four: the contract on the page, with its two answers. */
export function UiContract() {
  return (
    <div className="px-ui-card px-ui-vignette">
      <div className="px-ui-doc">
        <span className="ic" aria-hidden="true">
          <IconDoc />
        </span>
        <div>
          <b>Your contract</b>
          <small>Read it on the page</small>
        </div>
      </div>
      <div className="px-ui-lines" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="px-ui-answers">
        <span className="px-ui-btn is-sm">Accept</span>
        <span className="px-ui-btn is-ghost is-sm">Decline</span>
      </div>
    </div>
  );
}

/** The four pictures, in step order. */
export const UI_STEP_PICTURES: readonly React.ComponentType[] = [
  function StepMonth() {
    return (
      <div className="px-ui-vignette-wrap">
        <UiMonth compact />
      </div>
    );
  },
  UiDetails,
  UiDocuments,
  UiContract,
];
