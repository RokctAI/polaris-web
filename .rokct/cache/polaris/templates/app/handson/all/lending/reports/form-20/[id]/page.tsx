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

import React, { use, useEffect, useState } from "react";
import { getLoanApplication } from "@/app/actions/handson/all/lending/application";
import { getLoanProduct } from "@/app/actions/handson/all/lending/product";
import { getLendingLicenseDetails } from "@/app/actions/handson/all/lending/access";
import {
  calculateNCRQuote,
  NCR_MAX_SERVICE_FEE_PM,
} from "@/app/lib/lending/ncr_calculator";
import {
  RiLoader4Line,
  RiPrinterLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import Link from "next/link";
import { Form20Template } from "@/app/templates/lending/Form20Template";
import t from "@/app/lib/i18n";

export default function Form20Page({
  params: routeParams,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+ hands a page its route params as a Promise.
  const params = use(routeParams);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Dynamic NCR Calculation
  // Auto-fill defaults to Maximums (User Request)
  const [days, setDays] = useState(30);
  const [desiredServiceFee, setDesiredServiceFee] = useState(
    NCR_MAX_SERVICE_FEE_PM,
  );
  const [includeInsurance, setIncludeInsurance] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const appRes = await getLoanApplication(params.id);
        if (appRes.error || !appRes.data)
          throw new Error("Application not found");

        const app = appRes.data;
        const product = await getLoanProduct(app.loan_product);
        const company = await getLendingLicenseDetails();

        setData({ app, product, company });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <RiLoader4Line className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  if (!data)
    return (
      <div className="text-center p-12 text-red-600">{t('app.lending.form_20_load_error')}</div>
    );

  const { app, product, company } = data;

  // --- Dynamic Calculation ---
  const isVatRegistered = !!company?.taxId;
  const quoteResult = calculateNCRQuote({
    principal: app.loan_amount || 0,
    days: days,
    interestRateMonthly: (product?.rate_of_interest || 0) / 12, // Annual to Monthly
    monthlyServiceFee: desiredServiceFee,
    initiationFeePercent: 10, // Default 10% or from strict logic
    vatRate: isVatRegistered ? 15 : 0, // Dynamic VAT based on Tax ID
    includeInsurance: includeInsurance,
  });

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-8">
      {/* Control Panel (Test Different Scenarios) */}
      <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 print:hidden relative">
         <h3 className="font-bold text-gray-700 mb-4 flex items-center">
           <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded mr-2">
             ADMIN
           </span>
           {t('app.lending.quote_simulator_title')}
         </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
               {t('app.lending.quote_simulator.loan_period')}
             </label>
             <input
               type="number"
               value={days}
               onChange={(e) => setDays(Number(e.target.value))}
               className="w-full border border-gray-300 rounded p-2 text-sm"
             />
             <p className="text-xs text-gray-400 mt-1">
               {t('app.lending.quote_simulator.loan_period_desc')}
             </p>
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
               {t('app.lending.quote_simulator.service_fee')}
             </label>
             <div className="flex items-center">
               <span className="p-2 bg-gray-200 border border-gray-300 border-r-0 rounded-l text-gray-500 text-sm">
                 R
               </span>
               <input
                 type="number"
                 value={desiredServiceFee}
                 onChange={(e) => setDesiredServiceFee(Number(e.target.value))}
                 className="w-full border border-gray-300 rounded-r p-2 text-sm"
               />
             </div>
             <p className="text-xs text-gray-400 mt-1">
               {t('app.lending.quote_simulator.service_fee_max', { amount: NCR_MAX_SERVICE_FEE_PM.toFixed(2) })}
             </p>
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
               {t('app.lending.quote_simulator.insurance')}
             </label>
             <div className="flex items-center space-x-2 mt-2">
               <input
                 type="checkbox"
                 checked={includeInsurance}
                 onChange={(e) => setIncludeInsurance(e.target.checked)}
                 className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
               />
               <span className="text-sm font-medium">{t('app.lending.quote_simulator.include_insurance')}</span>
             </div>
             <p className="text-xs text-gray-400 mt-1">
               {t('app.lending.quote_simulator.insurance_desc')}
             </p>
          </div>

          {/* Compliance Status Indicator */}
          <div
            className={`p-4 rounded border ${quoteResult.validation.isCompliant ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {quoteResult.validation.isCompliant ? (
                <React.Fragment>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                           <span className="font-bold text-green-700 text-sm">
                             {t('app.lending.quote_simulator_compliant')}
                           </span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <RiErrorWarningLine className="w-4 h-4 text-red-600" />
                           <span className="font-bold text-red-700 text-sm">
                             {t('app.lending.quote_simulator_non_compliant')}
                           </span>
                </React.Fragment>
              )}
            </div>
            {!quoteResult.validation.isCompliant && (
              <ul className="text-xs text-red-600 list-disc list-inside">
                {quoteResult.validation.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Render the Official Form 20 Template */}
      <div className="print:m-0">
        <Form20Template
          app={app}
          product={product}
          company={company}
          quoteResult={quoteResult}
          calculations={{
            principal: quoteResult.capital,
            rate: product?.rate_of_interest || 0,
            term: days,
            installment: quoteResult.totalRepayment,
            initiationFee: quoteResult.initiationFee,
            serviceFee: quoteResult.serviceFee,
            totalRepayment: quoteResult.totalRepayment,
            costOfCredit: quoteResult.totalCost,
          }}
        />
      </div>
    </div>
  );
}
