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


// The frame of the borrower pages under /loans: the shell's wordmark, the
// two places a borrower goes (their loans, a new application) and sign out
// (auth_sdk's NextAuth sign-out page). Staff who land here get a link to
// the back office.

import Link from "next/link";

import { Branding } from "@/components/custom/branding";

export function LoansFrame({
  isStaff,
  children,
}: {
  isStaff: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-4">
          <Link href="/loans" className="min-w-0 font-semibold">
            <Branding />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {isStaff && (
              <Link href="/handson/all/lending" className="text-muted-foreground hover:text-foreground">
                Back office
              </Link>
            )}
            <Link href="/loans" className="text-muted-foreground hover:text-foreground">
              My loans
            </Link>
            <Link href="/loans/apply" className="text-muted-foreground hover:text-foreground">
              Apply
            </Link>
            <a href="/api/auth/signout" className="text-muted-foreground hover:text-foreground">
              Sign out
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
