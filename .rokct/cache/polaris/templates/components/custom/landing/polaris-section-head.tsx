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


// v3: the head every section of the landing opens with - the editorial
// grid the layout hangs on. A full-width rule; under it, in the narrow
// left column, the section's index and name in mono; in the wide right
// column the headline in the display face and the blurb under it. Reading
// down the left column is reading the page's contents.

import React from "react";

export function PolarisSectionHead({
  index,
  eyebrow,
  title,
  blurb,
  aside,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  blurb?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <header className="px-head">
      <p className="px-head-index">
        <span>{index}</span>
        {eyebrow}
      </p>
      <div className="px-head-main">
        <h2 className="px-display px-h2">{title}</h2>
        {blurb && <p className="px-lede">{blurb}</p>}
        {aside}
      </div>
    </header>
  );
}

export default PolarisSectionHead;
