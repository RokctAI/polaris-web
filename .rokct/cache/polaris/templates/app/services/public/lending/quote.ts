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

import { platformCall } from "@/app/services/base/platform-gateway";

// Public quote page: guest cmds, no session credentials sent. The cmds are
// fixed here so the page can never be used to call anything else.
export class PublicQuoteService {
  static get(token: string) {
    return platformCall<any>(
      "api.lending.get_quote_by_token",
      { token },
      { requireAuth: false },
    );
  }

  static accept(token: string) {
    return platformCall<any>(
      "api.lending.accept_quote",
      { token },
      { requireAuth: false, throwOnError: true },
    );
  }
}
