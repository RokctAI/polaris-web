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


// Registers Polaris's look as the first entry of base_sdk's landing host: a
// negative order, before the hero, so the tokens and the fonts are on the
// landing root for the header, the hero and every section. `rootClass`
// puts them there in the server's first HTML; the client half
// (landing/polaris-theme.tsx) adds <html>. `frame: true` hands the same
// look to base's site frame, so corporate_sdk's /about, /team and /legal
// pages wear it too. Renders nothing visible and is not a nav stop.
//
// No "use client" here: base reads `meta` in the server render, and every
// export of a client module is a client reference there.

import React from "react";

import { PolarisTheme } from "@/components/custom/landing/polaris-theme";
import { POLARIS_ROOT_CLASS } from "@/components/custom/landing/polaris-theme-classes";
import type {
  PageSectionMeta,
  PageSectionProps,
} from "@/components/custom/landing/page-sections";

export const meta: PageSectionMeta = {
  order: -2,
  nav: [],
  rootClass: POLARIS_ROOT_CLASS,
  frame: true,
};

export default function PolarisThemeSection(_props: PageSectionProps) {
  return <PolarisTheme />;
}
