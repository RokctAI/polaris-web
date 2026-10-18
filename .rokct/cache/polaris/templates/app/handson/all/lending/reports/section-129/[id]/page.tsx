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
import { getLendingLicenseDetails } from "@/app/actions/handson/all/lending/access";
import { Section129Template } from "@/app/templates/lending/Section129Template";
import { RiLoader4Line, RiMailLine, RiPrinterLine } from "@remixicon/react";
import { toast } from "sonner";
import t from "@/app/lib/i18n";

export default function Section129Page({
  params: routeParams,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+ hands a page its route params as a Promise.
  const params = use(routeParams);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const appRes = await getLoanApplication(params.id);
        if (appRes.error || !appRes.data) throw new Error("Application not found");
        const company = await getLendingLicenseDetails();
        setData({ app: appRes.data, company });
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
      <div className="p-12 text-center text-red-500">{t('common.not_found')}</div>
    );

  const { app, company } = data;
  const date = new Date().toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="text-right mb-4 space-x-3 print:hidden">
         <button
           onClick={() =>
             toast.success(
               t('app.lending.section_129_sent', { applicant: app?.applicant || t('common.applicant') }),
             )
           }
           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-sm"
         >
           <RiMailLine className="w-4 h-4 inline mr-2" /> {t('common.send_via_email')}
         </button>
         <button
           onClick={() => window.print()}
           className="bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition shadow-sm"
         >
           <RiPrinterLine className="w-4 h-4 inline mr-2" /> {t('common.print_notice')}
         </button>
      </div>

      <Section129Template app={app} company={company} date={date} />
    </div>
  );
}
