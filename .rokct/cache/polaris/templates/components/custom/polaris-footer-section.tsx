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
import { FooterChromeRow } from "@/components/custom/footer-chrome";
import { legalFooterLinks } from "@/components/custom/landing/legal-links";
import { POLARIS_MOTTO, polarisBrandName } from "@/components/custom/landing/polaris-brand";
import { POLARIS_FOOTER_CHROME } from "@/components/custom/landing/polaris-footer-chrome";
import { POLARIS_LANDING_CONFIG } from "@/components/custom/landing/polaris-landing-config";
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
  const terms = await listPublicTerms();
  const links = POLARIS_LANDING_CONFIG.footer.links;

  return (
    <footer
      id={id}
      className="px-sky w-full border-t border-[var(--px-line-soft)] py-14 text-[var(--px-ink-2)] md:py-20"
    >
      <div className="container mx-auto flex max-w-6xl flex-col gap-12 px-4 xl:px-0">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="flex flex-col gap-3">
            <p className="px-display text-3xl text-[var(--px-ink)]">{polarisBrandName()}</p>
            <p className="px-display text-xl !font-normal italic text-[var(--px-ember-text)]">
              {POLARIS_MOTTO}
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm font-medium sm:flex sm:flex-wrap"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[var(--px-ink)]"
              >
                {link.label}
              </Link>
            ))}
            <Link href={loginUrl} className="transition-colors hover:text-[var(--px-ink)]">
              Sign in
            </Link>
            <Link href={signupUrl} className="transition-colors hover:text-[var(--px-ink)]">
              Create an account
            </Link>
          </nav>
        </div>
        <FooterChromeRow
          config={{ ...POLARIS_FOOTER_CHROME, links: legalFooterLinks(terms) }}
          className="border-t border-[var(--px-line-soft)] pt-6"
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
