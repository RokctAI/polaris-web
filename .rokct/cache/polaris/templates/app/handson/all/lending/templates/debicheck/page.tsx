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

import React from "react";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiSmartphoneLine,
  RiTimeLine,
  RiShieldCheckLine,
} from "@remixicon/react";
import t from "@/app/lib/i18n";

export default function DebiCheckPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <RiShieldCheckLine className="w-8 h-8 text-green-600" />
        </div>
         <h1 className="text-3xl font-bold text-gray-900">{t('app.lending.debicheck_title')}</h1>
         <p className="text-lg font-medium text-gray-600">
           {t('app.lending.debicheck_desc')}
         </p>
      </div>

      {/* Introduction Card */}
       <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
         <p className="text-gray-700 leading-relaxed">
           {t('app.lending.debicheck_intro')}
         </p>
         <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
           <RiSmartphoneLine className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
           <p className="text-sm text-blue-800">
             {t('app.lending.debicheck_sms_note')}
           </p>
         </div>
       </div>

      {/* Instructions Section */}
       <div className="space-y-4">
         <h2 className="text-xl font-bold text-gray-900">{t('app.lending.debicheck_how_to')}</h2>
         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
           <div className="p-6 flex items-start space-x-4">
             <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 font-bold text-gray-600">
               1
             </div>
             <div>
               <h3 className="font-semibold text-gray-900 mb-1">
                 {t('app.lending.debicheck.step_1_title')}
               </h3>
               <p className="text-gray-600 text-sm">
                 {t('app.lending.debicheck.step_1_desc')}
               </p>
             </div>
           </div>
           <div className="p-6 flex items-start space-x-4">
             <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 font-bold text-gray-600">
               2
             </div>
             <div>
               <h3 className="font-semibold text-gray-900 mb-1">
                 {t('app.lending.debicheck.step_2_title')}
               </h3>
               <p className="text-gray-600 text-sm">
                 {t('app.lending.debicheck.step_2_desc')}
               </p>
             </div>
           </div>
           <div className="p-6 flex items-start space-x-4">
             <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 font-bold text-gray-600">
               3
             </div>
             <div>
               <h3 className="font-semibold text-gray-900 mb-1">
                 {t('app.lending.debicheck.step_3_title')}
               </h3>
               <p className="text-gray-600 text-sm">
                 {t('app.lending.debicheck.step_3_desc')}
               </p>
             </div>
           </div>
         </div>
       </div>

      {/* Timer / Expiry Warning */}
       <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 flex items-start space-x-4">
         <RiTimeLine className="w-6 h-6 text-orange-600 mt-0.5 shrink-0" />
         <div>
           <h3 className="font-semibold text-orange-900">
             {t('app.lending.debicheck_deadline', { time: '20:00' })}
           </h3>
           <p className="text-sm text-orange-800 mt-1">
             {t('app.lending.debicheck_deadline_desc', { time: '20:00' })}
           </p>
         </div>
       </div>

      {/* Disclaimer Footer */}
       <div className="bg-gray-50 rounded-xl p-6 text-xs text-gray-500 space-y-2">
         <p className="font-semibold text-gray-700">{t('common.please_note')}</p>
         <p>
           {t('app.lending.debicheck_disclaimer_1')}
         </p>
         <p>
           {t('app.lending.debicheck_disclaimer_2')}
         </p>
       </div>
    </div>
  );
}
