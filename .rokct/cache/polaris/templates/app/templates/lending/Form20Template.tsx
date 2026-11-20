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

import React from "react";

import t from "@/app/lib/i18n";
interface Form20TemplateProps {
  app: any;
  product: any;
  company: any;
  calculations: {
    principal: number;
    rate: number;
    term: number;
    installment: number;
    initiationFee: number;
    serviceFee: number;
    totalRepayment: number;
    costOfCredit: number;
  };
  quoteResult?: any;
}

export const Form20Template: React.FC<Form20TemplateProps> = ({
  app,
  product,
  company,
  calculations,
  quoteResult,
}) => {
  const {
    principal,
    rate,
    term,
    installment,
    initiationFee,
    serviceFee,
    totalRepayment,
  } = calculations;

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white p-12 shadow-lg print:shadow-none print:p-0 text-sm md:text-base font-serif text-justify border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b border-black pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            {t("polaris.pre_agreement_statement_quotation")}
          </h1>
          <p className="text-sm text-gray-600 italic mt-1">
            Form 20 • National Credit Act 34 of 2005
          </p>
        </div>
      </div>

      {/* Provider Details */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold border-b border-gray-400 mb-2 uppercase text-xs text-gray-500">
            {t("polaris.credit_provider")}
          </h3>
          <p className="font-bold text-lg">
            {company?.companyName || "Credit Provider Name"}
          </p>
          <p>NCRCP: {company?.licenseNumber || "NCRCPXXXX"}</p>
          <p>Address: [Insert Physical Address]</p>
          <p>Contact: [Insert Number]</p>
        </div>
        <div>
          <h3 className="font-bold border-b border-gray-400 mb-2 uppercase text-xs text-gray-500">
            {t("polaris.consumer")}
          </h3>
          <p className="font-bold text-lg">{app?.applicant}</p>
          <p>ID/Reg No: [Insert ID]</p>
          <p>Address: [Insert Address]</p>
          <p>Quote Date: {new Date().toLocaleDateString()}</p>
          <p className="text-red-600 font-bold">{t("polaris.valid_for_5_days")}</p>
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-50 border-l-4 border-black text-xs italic">
        <p>
          <strong>{t("polaris.note")}</strong> This document details the terms and costs of
          the proposed credit agreement. It is a binding offer for 5 business
          days. You have the right to accept or decline this offer.
        </p>
      </div>

      {/* Financial Terms */}
      {quoteResult ? (
        <table className="w-full border-collapse border border-black mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left w-1/2">
                {t("polaris.description")}
              </th>
              <th className="border border-black p-2 text-right">{t("polaris.value")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">
                {t("polaris.principal_debt_loan_amount")}
              </td>
              <td className="border border-black p-2 text-right font-bold">
                R {quoteResult.capital.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                {t("polaris.initiation_fee_once_off")}
              </td>
              <td className="border border-black p-2 text-right">
                R {quoteResult.initiationFee.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 bg-gray-50 font-bold">
                {t("polaris.total_advanced")}
              </td>
              <td className="border border-black p-2 text-right font-bold bg-gray-50">
                R{" "}
                {(
                  quoteResult.capital + quoteResult.initiationFee
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="w-full border-collapse border border-black mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left w-1/2">
                {t("polaris.description")}
              </th>
              <th className="border border-black p-2 text-right">{t("polaris.value")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">
                {t("polaris.principal_debt_loan_amount")}
              </td>
              <td className="border border-black p-2 text-right font-bold">
                R{" "}
                {principal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                {t("polaris.initiation_fee_once_off")}
              </td>
              <td className="border border-black p-2 text-right">
                R{" "}
                {initiationFee.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 bg-gray-50 font-bold">
                {t("polaris.total_advanced")}
              </td>
              <td className="border border-black p-2 text-right font-bold bg-gray-50">
                R{" "}
                {(principal + initiationFee).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Cost of Credit */}
      <h3 className="font-bold text-lg mb-2 uppercase">{t("polaris.cost_of_credit")}</h3>
      <table className="w-full border-collapse border border-black mb-8 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2 text-left w-1/2">
              {t("polaris.description")}
            </th>
            <th className="border border-black p-2 text-right">{t("polaris.value")}</th>
          </tr>
        </thead>
        {quoteResult ? (
          <tbody>
            <tr>
              <td className="border border-black p-2 text-gray-500">
                {t("polaris.capital_principal")}
              </td>
              <td className="border border-black p-2 text-right text-gray-500">
                R {quoteResult.capital.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">{t("polaris.interest")}</td>
              <td className="border border-black p-2 text-right">
                R {quoteResult.interest.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">{t("polaris.service_fee")}</td>
              <td className="border border-black p-2 text-right">
                R {quoteResult.serviceFee.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">{t("polaris.initiation_fee")}</td>
              <td className="border border-black p-2 text-right">
                R {quoteResult.initiationFee.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">{t("polaris.vat_15")}</td>
              <td className="border border-black p-2 text-right">
                R {quoteResult.vat.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">{t("polaris.insurance")}</td>
              <td className="border border-black p-2 text-right">
                R {quoteResult.insurance.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold bg-yellow-50">
                {t("polaris.total_repayment_amount")}
              </td>
              <td className="border border-black p-2 text-right font-bold bg-yellow-50">
                R {quoteResult.totalRepayment.toFixed(2)}
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td className="border border-black p-2">
                {t("polaris.interest_rate_annual")}
              </td>
              <td className="border border-black p-2 text-right">{rate}%</td>
            </tr>
            <tr>
              <td className="border border-black p-2">{t("polaris.monthly_service_fee")}</td>
              <td className="border border-black p-2 text-right">
                R {serviceFee.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                {t("polaris.number_of_installments")}
              </td>
              <td className="border border-black p-2 text-right">
                {term} Months
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold bg-yellow-50">
                {t("polaris.monthly_installment_estimated")}
              </td>
              <td className="border border-black p-2 text-right font-bold bg-yellow-50">
                R{" "}
                {(installment + serviceFee).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">
                {t("polaris.total_amount_repayable")}
              </td>
              <td className="border border-black p-2 text-right font-bold">
                R{" "}
                {(
                  totalRepayment +
                  initiationFee +
                  serviceFee * term
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        )}
      </table>

      {/* Legal Declarations */}
      <div className="space-y-4 text-xs leading-relaxed text-justify mb-12">
        <p>
          <strong>{t("polaris.early_settlement")}</strong> You have the right to settle this
          agreement at any time without penalty (for small agreements). The
          settlement amount will be the unpaid balance plus unpaid interest and
          fees up to the settlement date.
        </p>
        <p>
          <strong>{t("polaris.default_administration_costs")}</strong> If you default on
          urgency, you will be liable for default administration charges and
          collection costs as permitted by the Act.
        </p>
        <p>
          <strong>{t("polaris.marketing_options")}</strong> You have the right to decline
          marketing options.
        </p>
      </div>

      {/* Asset / Affordability Declaration */}
      {app.is_secured_loan ? (
        <div className="border-2 border-dashed border-gray-400 p-4 mb-8 bg-gray-50">
          <h3 className="font-bold border-b border-gray-400 mb-2 uppercase text-sm">
            {t("polaris.security_pledge_asset_backed")}
          </h3>
          <p className="mb-2">
            I, the undersigned, hereby pledge the following asset as security
            for this loan. I understand that failure to repay may result in the
            sale of this asset to recover the debt.
          </p>
          <div className="bg-white p-3 border border-gray-300 font-mono text-sm min-h-[60px]">
            {app.description || "No Asset Description Provided"}
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 p-4 mb-8">
          <h3 className="font-bold border-b border-gray-200 mb-2 uppercase text-sm">
            {t("polaris.affordability_declaration")}
          </h3>
          <p className="italic">
            I confirm that the income and expense information provided is true
            and correct, and that I have the financial means to meet these
            obligations.
          </p>
        </div>
      )}

      {/* Acceptance */}
      <div className="border border-black p-6 page-break-inside-avoid">
        <h3 className="font-bold border-b border-black mb-4 pb-2">
          {t("polaris.acceptance_of_quote")}
        </h3>
        <p className="mb-8">
          I, the undersigned consumer, hereby acknowledge receipt of this
          Pre-agreement Statement and Quotation. I confirm that I understand the
          costs, risks, and obligations associated with this credit agreement.
        </p>

        <div className="grid grid-cols-2 gap-12 mt-12">
          <div>
            <div className="border-b border-gray-400 h-8"></div>
            <p className="text-xs uppercase mt-1 text-gray-500">
              {t("polaris.signature_of_consumer")}
            </p>
          </div>
          <div>
            <div className="border-b border-gray-400 h-8"></div>
            <p className="text-xs uppercase mt-1 text-gray-500">{t("polaris.date")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
