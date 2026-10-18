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
// (components/custom/landing/header-menu.ts). The anchors are resolved
// against the page's live nav, in page order (the sections' meta.nav ids),
// so reading the bar is reading down the page; About is corporate_sdk's
// page, in Polaris's frame. The brand slot draws no image: the host's
// wordmark is the brand, restyled by polaris-theme.css.

import type { HeaderMenu } from "@/components/custom/landing/header-menu";

const POLARIS_HEADER_MENU: HeaderMenu = {
  brand: { logo: "none" },
  anchors: ["why", "how-it-works", "costs", "faq"],
  links: [{ id: "about", label: "About", href: "/about" }],
};

export default POLARIS_HEADER_MENU;
