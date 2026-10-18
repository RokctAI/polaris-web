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


// The Polaris web app's header menu, for base_sdk's header-menu registry
// (components/custom/landing/header-menu.ts). One anchor, resolved against
// the page's live nav (polaris-how-it-works-section.tsx registers it); the
// header already draws Log in and Sign up. No Polaris artwork exists, so the
// header draws the shell's wordmark alone.

import type { HeaderMenu } from "@/components/custom/landing/header-menu";

const POLARIS_HEADER_MENU: HeaderMenu = {
  brand: { logo: "none" },
  anchors: ["how-it-works"],
};

export default POLARIS_HEADER_MENU;
