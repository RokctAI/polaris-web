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

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { RiSmartphoneLine } from "@remixicon/react";
import { getPhoneDeclines } from "@/app/actions/handson/all/lending/phone_declines";
import { getSessionCurrency } from "@/app/actions/handson/all/lending/currency";

import t from "@/app/lib/i18n";
// Applicants turned away on the phone before an application existed.
// "Not eligible" = the app's check said no; "Declined offer" = the borrower
// turned down the amount offered. Figures are as typed, never verified.
function reasonOf(row: any): string {
  try {
    const list = typeof row.reasons === "string" ? JSON.parse(row.reasons) : row.reasons;
    return (list || []).map((r: any) => r?.reason).filter(Boolean).join("; ");
  } catch {
    return "";
  }
}

export default function PhoneDeclinesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState("ZAR");

  useEffect(() => {
    Promise.all([getPhoneDeclines(), getSessionCurrency()]).then(([res, cur]) => {
      setRows(res.data || []);
      setError(res.error);
      setCurrency(cur);
      setIsLoading(false);
    });
  }, []);

  const money = (n: number) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(n || 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("polaris.declined_on_phone")}</h1>
        <p className="text-gray-500 mt-1">
          People the app turned away, or who turned down the offer, before an
          application was sent. Figures are what they typed and were not checked.
        </p>
      </div>

      <div className="glass-card shadow-2xl border-none rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-16 text-center text-slate-500 font-medium">{t("polaris.loading")}</p>
        ) : error ? (
          <p className="p-16 text-center text-rose-600 font-medium">{error}</p>
        ) : rows.length === 0 ? (
          <div className="p-20 flex flex-col items-center text-center">
            <RiSmartphoneLine className="w-10 h-10 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">{t("polaris.nobody_has_been_declined_on_the_phone_yet")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="p-4">{t("polaris.date")}</th>
                  <th className="p-4">{t("polaris.customer")}</th>
                  <th className="p-4">{t("polaris.outcome")}</th>
                  <th className="p-4 text-right">{t("polaris.amount_asked")}</th>
                  <th className="p-4 text-right">{t("polaris.income_typed")}</th>
                  <th className="p-4 text-right">{t("polaris.expenses_typed")}</th>
                  <th className="p-4">{t("polaris.reason")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td className="p-4 whitespace-nowrap">
                      {r.creation ? format(new Date(r.creation), "MMM dd, yyyy HH:mm") : ""}
                    </td>
                    <td className="p-4">{r.customer || r.user || "Unknown"}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          r.status === "ineligible"
                            ? "text-rose-700 bg-rose-50 border-rose-100"
                            : "text-amber-700 bg-amber-50 border-amber-100"
                        }`}
                      >
                        {r.status === "ineligible" ? "Not eligible" : "Declined offer"}
                      </span>
                    </td>
                    <td className="p-4 text-right">{money(r.loan_amount)}</td>
                    <td className="p-4 text-right">{money(r.monthly_income)}</td>
                    <td className="p-4 text-right">{money(r.monthly_expenses)}</td>
                    <td className="p-4 text-slate-600">{reasonOf(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
