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


// The class names Polaris's look hangs on, in one list, so the theme
// section (meta.rootClass, the server render) and the theme effect (<html>,
// the client) name exactly the same set. Kept apart from polaris-theme.tsx
// because that module is a client module and every export of a client
// module is a client reference in the server render.

import { polarisDisplay, polarisSans } from "./polaris-fonts";

/** The class every polaris-theme.css rule is scoped to. */
export const POLARIS_THEME_CLASS = "px-landing";

/** The token class and the two font variables. */
export const POLARIS_THEME_CLASSES: readonly string[] = [
  POLARIS_THEME_CLASS,
  polarisSans.variable,
  polarisDisplay.variable,
];

/** POLARIS_THEME_CLASSES as base_sdk's `PageSectionMeta.rootClass` wants it: space-separated. */
export const POLARIS_ROOT_CLASS = POLARIS_THEME_CLASSES.join(" ");
