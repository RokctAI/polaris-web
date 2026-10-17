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

"use server";

import { PublicQuoteService } from "@/app/services/public/lending/quote";

// No login: the token in the link is the only key.
export async function getPublicQuote(token: string) {
  const res = await PublicQuoteService.get(token);
  return res?.message ?? res ?? null;
}

export async function acceptPublicQuote(token: string) {
  const res = await PublicQuoteService.accept(token);
  return res?.message ?? res ?? null;
}
