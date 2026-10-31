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


// v3: the motto large, the links in two columns (this page, and the
// company's pages and the two doors), and the name set across the whole
// width as the page's last word - a wordmark, hidden from assistive tech
// since the header and the chrome row already name the site.
//
// The Polaris landing's footer, for base_sdk's page-sections registry: the
// wordmark and the motto, the section links and the two doors, and base's
// FooterChromeRow (copyright, version, status) with the Legal link group
// drawn from base's guest read `listPublicTerms()` (the enabled Terms and
// Conditions documents, or the shell's bundled data/legal/ pages), so the
// footer links corporate_sdk's /legal/<name> pages the moment one exists
// and draws no group before. A server component, so it can await that
// read. `frame: true`: base's site frame draws it under /about, /team and
// /legal too, so every page ends the way the landing does.

import React from "react";
import Link from "next/link";

import { listPublicTerms } from "@/app/actions/base/legal";
import { fetchPolarisDownloadAvailability } from "@/app/download/release";
import { FooterChromeRow } from "@/components/custom/footer-chrome";
import { legalFooterLinks } from "@/components/custom/landing/legal-links";
import { POLARIS_MOTTO, polarisBrandName } from "@/components/custom/landing/polaris-brand";
import { POLARIS_FOOTER_CHROME } from "@/components/custom/landing/polaris-footer-chrome";
import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
import { PolarisStoreBadges } from "@/components/custom/landing/polaris-store-badges";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export async function PolarisFooterSection({
  id,
  loginUrl,
  signupUrl,
}: {
  id?: string;
  loginUrl: string;
  signupUrl: string;
}) {
  const [terms, available] = await Promise.all([listPublicTerms(), fetchPolarisDownloadAvailability()]);
  const links = POLARIS_LANDING_CONFIG.footer.links;

  return (
    <footer id={id} className="px-footer w-full">
      <div className="px-wrap">
        <div className="px-footer-top">
          <div className="px-footer-lead">
            <p className="px-display px-footer-motto">
              <em>{POLARIS_MOTTO}</em>
            </p>
            <PolarisStoreBadges available={available} />
          </div>
          <nav aria-label="Footer" className="px-footer-nav">
            <div>
              <p className="px-head-index">On this page</p>
              {links
                .filter((link) => link.href.startsWith("#"))
                .map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
            </div>
            <div>
              <p className="px-head-index">{polarisBrandName()}</p>
              {links
                .filter((link) => !link.href.startsWith("#"))
                .map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              <Link href={loginUrl}>Sign in</Link>
              <Link href={signupUrl}>Create an account</Link>
            </div>
          </nav>
        </div>
        <p className="px-footer-mark" aria-hidden="true">
          {polarisBrandName()}
        </p>
        <FooterChromeRow
          config={{ ...POLARIS_FOOTER_CHROME, links: legalFooterLinks(terms) }}
          className="px-footer-chrome"
        />
      </div>
    </footer>
  );
}

export const meta: PageSectionMeta = {
  order: 95,
  nav: [],
  anchor: "site-footer",
  frame: true,
};

export default function PolarisFooterPageSection({ id, loginUrl, signupUrl }: PageSectionProps) {
  return <PolarisFooterSection id={id} loginUrl={loginUrl} signupUrl={signupUrl} />;
}
