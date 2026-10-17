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


// The Polaris web app's plans query, for base_sdk's plans-query registry
// (components/custom/landing/plans-query.ts): none. The platform's
// Subscription Plan catalog is what a LENDER buys, not what a borrower is
// offered, so a borrower's landing prefetches no plans at all.

import type { LandingPlansQuery } from "@/components/custom/landing/landing-config";

const POLARIS_PLANS_QUERY: LandingPlansQuery | null = null;

export default POLARIS_PLANS_QUERY;
