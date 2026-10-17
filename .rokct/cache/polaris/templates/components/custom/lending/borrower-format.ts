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


// Formatting and wording shared by the borrower pages under /loans.

export function money(value: number | null | undefined, currency?: string | null) {
  const amount = Number(value ?? 0);
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency || "ZAR",
    }).format(amount);
  } catch {
    return `${currency ?? ""} ${amount.toFixed(2)}`.trim();
  }
}

export function day(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(date);
}

/** What an application's status means to the borrower. */
export const STATUS_WORDS: Record<string, { label: string; tone: "neutral" | "good" | "bad" | "wait" ; line: string }> = {
  Draft: {
    label: "Not sent yet",
    tone: "neutral",
    line: "You started this application but have not sent it.",
  },
  Submitted: {
    label: "With us",
    tone: "wait",
    line: "We have your application and are checking it. Upload any missing documents below.",
  },
  Approved: {
    label: "Approved",
    tone: "good",
    line: "Your loan is approved. Read the contract below and accept or decline it.",
  },
  Rejected: {
    label: "Not approved",
    tone: "bad",
    line: "We could not approve this application.",
  },
  Disbursed: {
    label: "Paid out",
    tone: "good",
    line: "The money has been paid out.",
  },
  Cancelled: {
    label: "Cancelled",
    tone: "neutral",
    line: "This application was cancelled.",
  },
};

export function statusWords(status: string | null | undefined) {
  return (
    STATUS_WORDS[status ?? ""] ?? {
      label: status || "Unknown",
      tone: "neutral" as const,
      line: "",
    }
  );
}
