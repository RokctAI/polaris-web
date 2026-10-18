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


// The questions on the Polaris landing, for base_sdk's page-sections
// registry. The entry module stays server-safe - base reads `meta` in the
// server render - and draws the client half (polaris-faq-section.client.tsx,
// the one open item) for the list. Copy: POLARIS_LANDING_CONFIG.faq.

import React from "react";

import { PolarisFaqSection } from "@/components/custom/polaris-faq-section.client";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export const meta: PageSectionMeta = {
  order: 80,
  nav: [{ id: "faq", label: "Questions" }],
};

export default function PolarisFaqPageSection({ id }: PageSectionProps) {
  return <PolarisFaqSection id={id} />;
}
