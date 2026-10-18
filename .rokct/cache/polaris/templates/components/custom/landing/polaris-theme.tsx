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


// The client half of Polaris's look: imports the stylesheet (one global
// import, as next/font wants) and, while the landing is up, puts the token
// class and the font variables on <html> too - the body background and the
// colour-scheme can only be set from there - defaulting the mode to dark
// when nothing has chosen, without overriding a choice the header's toggle
// made. The server half is polaris-theme-section.tsx, whose meta.rootClass
// has base put the same classes on the landing root in the first HTML.

"use client";

import { useEffect } from "react";

import "./polaris-theme.css";
import { POLARIS_THEME_CLASSES } from "./polaris-theme-classes";

export function PolarisTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const added = POLARIS_THEME_CLASSES.filter((name) => !root.classList.contains(name));
    added.forEach((name) => root.classList.add(name));
    const defaulted = !root.classList.contains("dark") && !root.classList.contains("light");
    if (defaulted) root.classList.add("dark");
    return () => {
      added.forEach((name) => root.classList.remove(name));
      if (defaulted) root.classList.remove("dark");
    };
  }, []);
  return null;
}

export default PolarisTheme;
