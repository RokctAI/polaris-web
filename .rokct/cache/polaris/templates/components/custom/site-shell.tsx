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

// polaris_sdk 1.10.0: the Polaris frame for auth_sdk's pages (login,
// register, forgot-password). Ray: every app shell gets its own design for
// register and login (the pattern hosting_sdk 1.21.0 set for Cortex).
//
// auth_sdk >= 1.12.0 wraps those pages in SiteShell from this path and
// installs a generic default here. polaris_sdk is the polaris shell's home
// SDK, so the installer keeps this copy. The landing at /landing is base's
// composed landing wearing the Polaris theme (PolarisTheme puts .px-landing
// and the four font variables on <html>, and polaris-theme.css maps base's
// header and the shadcn tokens to the dark green and lime, light and dark);
// the auth pages get the same: PolarisTheme, base's Header as the landing
// draws it, a brand panel beside the card and the landing footer's motto
// and credit line (no oversized wordmark: Ray's rule for every site).
// Presentation only: auth_sdk's views, actions and fields are
// untouched. Client-safe: the landing's own footer section is an async
// server component (it reads the legal terms and the app release), so the
// footer here is drawn from its classes and words instead.

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import "@/components/custom/polaris-auth/polaris-auth.css";

import { Header } from "@/components/custom/header";
import { SiteCredit } from "@/components/custom/site-credit";
import { LANDING_CONFIG } from "@/components/custom/landing/landing-config";
import { POLARIS_MOTTO, polarisBrandName } from "@/components/custom/landing/polaris-brand";
import { PolarisTheme } from "@/components/custom/landing/polaris-theme";
import { POLARIS_AUTH_COPY, polarisAuthPanel } from "@/components/custom/polaris-auth/polaris-auth-copy";

export interface SiteShellProps {
  children: ReactNode;
  /** Header "Log in" handler from the auth page, passed to base's Header. */
  openLoginPopup?: () => void;
  /** Header "Sign up" handler from the auth page, passed to base's Header. */
  openSignupPopup?: () => void;
}

export function SiteShell({ children, openLoginPopup, openSignupPopup }: SiteShellProps) {
  const name = polarisBrandName();
  const panel = polarisAuthPanel(usePathname(), name);
  return (
    <div className="pa-root flex flex-col min-h-screen">
      <PolarisTheme />
      <Header openLoginPopup={openLoginPopup} openSignupPopup={openSignupPopup} />
      <main className="pa">
        <div className="px-wrap pa-g">
          <aside className="pa-side" aria-label={`About ${name}`}>
            <p className="pa-kick">{panel.kicker}</p>
            <p className="pa-h">
              {panel.title.map((line, i) => (i === panel.title.length - 1 ? <em key={line}>{line}</em> : <span key={line}>{line}</span>))}
            </p>
            <p className="pa-lede">{panel.lede}</p>
            <ul className="pa-pts">
              {POLARIS_AUTH_COPY.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </aside>
          <div className="pa-card">{children}</div>
        </div>
      </main>
      <footer className="px-footer w-full">
        <div className="px-wrap">
          <div className="px-footer-top">
            <p className="px-display px-footer-motto">
              <em>{POLARIS_MOTTO}</em>
            </p>
            <nav aria-label="Footer" className="pa-foot-nav">
              <a href="/landing">Home</a>
              <a href={LANDING_CONFIG.loginUrl}>Sign in</a>
              <a href={LANDING_CONFIG.signupUrl}>Create an account</a>
            </nav>
          </div>
          <SiteCredit as="p" siteName={name} className="pa-credit" />
        </div>
      </footer>
    </div>
  );
}

/** The mark above the auth card: the wordmark in the landing's display face (Polaris ships no logo artwork). */
export function SiteShellLogo({ size = 56 }: { size?: number }) {
  return (
    <span className="pa-mark" style={{ fontSize: Math.round(size * 0.6) }} aria-hidden="true">
      {polarisBrandName()}
    </span>
  );
}
