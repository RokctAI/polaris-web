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


import { cn } from "@/lib/utils";

import { statusWords } from "./borrower-format";

const TONES = {
  neutral: "bg-muted text-muted-foreground",
  good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  bad: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  wait: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
};

/** An application's status in the borrower's words. */
export function ApplicationStatus({
  status,
  className,
}: {
  status: string | null | undefined;
  className?: string;
}) {
  const words = statusWords(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONES[words.tone],
        className,
      )}
    >
      {words.label}
    </span>
  );
}
