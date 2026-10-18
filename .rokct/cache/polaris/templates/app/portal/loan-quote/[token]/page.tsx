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

"use client";

import { use, useEffect, useState } from "react";

import {
  acceptPublicQuote,
  getPublicQuote,
} from "@/app/actions/public/lending/quote";

// Public page: the link a lender shares with a client who has no app. No
// login; the token is the key. Accepting records the client's yes to the
// quote; the loan still goes through the credit decision and the contract.
export default function PublicLoanQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [quote, setQuote] = useState<any>(undefined);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicQuote(token)
      .then((q) => setQuote(q && q.lines ? q : null))
      .catch(() => setQuote(null));
  }, [token]);

  async function accept() {
    setError(null);
    setAccepting(true);
    try {
      const updated = await acceptPublicQuote(token);
      if (updated?.lines) setQuote(updated);
    } catch {
      setError("We could not record your acceptance. Please try again.");
    } finally {
      setAccepting(false);
    }
  }

  if (quote === undefined)
    return <p className="p-6 text-gray-600">Loading your quote…</p>;
  if (quote === null)
    return (
      <p className="p-6 text-gray-700">
        This quote link is invalid, expired or has been replaced. Please ask
        your lender for a new one.
      </p>
    );

  const lines: { label: string; amount: string }[] = quote.lines || [];
  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <div>
        <p className="text-sm font-semibold text-gray-500">
          Loan quote · {quote.date}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {quote.headline}
        </h1>
      </div>

      <div>
        <p className="text-4xl font-bold text-gray-900">{quote.total}</p>
        <p className="text-gray-600">{quote.total_label}</p>
      </div>

      <dl className="divide-y divide-gray-200 border-y border-gray-200">
        {lines.map((line, i) => (
          <div
            key={line.label}
            className={`flex justify-between py-3 ${i === lines.length - 1 ? "font-bold text-gray-900" : "text-gray-700"}`}
          >
            <dt>{line.label}</dt>
            <dd>{line.amount}</dd>
          </div>
        ))}
      </dl>

      {quote.accepted_on ? (
        <p className="rounded-lg bg-green-50 p-4 font-medium text-green-800">
          Thank you. You accepted this quote. Your lender will be in touch.
        </p>
      ) : quote.can_accept ? (
        <div className="space-y-2">
          <button
            onClick={accept}
            disabled={accepting}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {accepting ? "Accepting…" : "Accept this quote"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <p className="text-gray-700">
          This quote can no longer be accepted. Please contact your lender.
        </p>
      )}

      <p className="text-xs text-gray-500">{quote.footer}</p>
    </main>
  );
}
