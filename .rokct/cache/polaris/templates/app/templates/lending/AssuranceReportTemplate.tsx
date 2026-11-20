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
interface AssuranceReportTemplateProps {
  company: any;
  date: string;
  reportType: "audited" | "accounting_officer";
  yearEnd: string;
}

export const AssuranceReportTemplate: React.FC<
  AssuranceReportTemplateProps
> = ({ company, date, reportType, yearEnd }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg print:shadow-none print:p-0 font-serif text-justify border border-gray-200">
      {/* Disclaimer placeholder for Letterhead printing */}
      <div className="print:hidden bg-yellow-50 border border-yellow-200 p-4 mb-8 text-sm text-yellow-800 rounded">
        <strong>{t("polaris.for_output")}</strong> This document is designed to be printed on
        your Auditor&apos;s or Accounting Officer&apos;s official letterhead.
      </div>

      <div className="text-center font-bold uppercase mb-8 text-xl">
        {reportType === "audited"
          ? "Assurance Report (Audited)"
          : "Assurance Report (Accounting Officer)"}
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <p>
            <strong>{t("polaris.to")}</strong> {t("polaris.the_national_credit_regulator")}
          </p>
          <p>
            <strong>{t("polaris.from")}</strong> {company?.companyName || "Registrant Name"}
          </p>
          <p>
            <strong>{t("polaris.ncr_registration_no")}</strong>{" "}
            {company?.licenseNumber || "NCRCPXXXX"}
          </p>
          <p>
            <strong>{t("polaris.date")}</strong> {date}
          </p>
        </div>
      </div>

      <h2 className="font-bold text-lg mb-4 uppercase text-center">
        Compliance Report for the Year Ended {yearEnd}
      </h2>

      <p className="mb-4">
        We have performed the duties of{" "}
        {reportType === "audited" ? "auditor" : "accounting officer"} for{" "}
        <strong>{company?.companyName}</strong> for the year ended{" "}
        <strong>{yearEnd}</strong> as required by Regulation 68 of the National
        Credit Act, 34 of 2005.
      </p>

      <h3 className="font-bold mb-2">{t("polaris.responsibility")}</h3>
      <p className="mb-4">
        The management of the registrant is responsible for compliance with the
        Act and Regulations. Our responsibility is to report on the
        registrant&apos;s compliance based on our engagement.
      </p>

      <h3 className="font-bold mb-2">{t("polaris.scope")}</h3>
      <p className="mb-4">
        We conducted our examination in accordance with the International
        Standards on Assurance Engagements (ISAE 3000). This standard requires
        that we comply with ethical requirements and plan and perform the
        assurance engagement to obtain reasonable assurance whether the
        registrant has complied with the Act.
      </p>

      {reportType === "accounting_officer" && (
        <div className="mb-4 bg-blue-50 p-4 border-l-4 border-blue-500 text-sm italic print:bg-transparent print:border-none print:p-0 print:text-black">
          <p>
            <strong>{t("polaris.note_for_accounting_officer")}</strong> This report is based
            on the results of our duties as Accounting Officer, which are less
            extensive than a full audit.
          </p>
        </div>
      )}

      <h3 className="font-bold mb-2">{t("polaris.conclusion")}</h3>
      <p className="mb-8">
        Based on our work described in this report, in our opinion, the
        registrant{" "}
        <strong>{t("polaris.has_has_not_delete_whichever_is_not_applicable")}</strong>{" "}
        complied with the following sections of the Act:
      </p>

      <ul className="list-disc pl-8 mb-8 space-y-1">
        <li>{t("polaris.section_52_failed_to_register")}</li>
        <li>{t("polaris.section_81_prevention_of_reckless_credit")}</li>
        <li>{t("polaris.section_92_pre_agreement_disclosure")}</li>
        <li>{t("polaris.section_93_form_of_credit_agreement")}</li>
        <li>{t("polaris.chapter_5_part_e_interest_and_fees")}</li>
      </ul>

      <div className="mt-16 grid grid-cols-2 gap-12">
        <div>
          <div className="border-b border-black h-8"></div>
          <p className="mt-2 font-bold">
            {reportType === "audited"
              ? "Registered Auditor Signature"
              : "Accounting Officer Signature"}
          </p>
        </div>
        <div>
          <div className="border-b border-black h-8"></div>
          <p className="mt-2 font-bold">{t("polaris.date")}</p>
        </div>
      </div>

      <div className="mt-8 space-y-1 text-sm">
        <p>
          <strong>{t("polaris.name")}</strong> _________________________________
        </p>
        <p>
          <strong>{t("polaris.practice_number")}</strong> _____________________
        </p>
        <p>
          <strong>{t("polaris.professional_body")}</strong> ______________________
        </p>
      </div>
    </div>
  );
};
