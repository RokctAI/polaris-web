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


// The documents a borrower can attach from the web app, with the same rules
// the backend applies (polaris/frappe/src/tenant/api/documents.py): any
// document may be a PDF or a photo, except the bank statement, which must
// be the PDF the bank produced (Ray, 2026-10-17). MAX_DOCUMENT_BYTES is the
// web app's own cap, under a Vercel function's 4.5 MB request limit; the
// backend's is 10 MB.

export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;

const PHOTO_OR_PDF = ["pdf", "jpg", "jpeg", "png", "heic", "heif", "webp"];

export interface BorrowerDocument {
  type: string;
  label: string;
  hint: string;
  pdfOnly: boolean;
  extensions: string[];
  /** The file picker's accept list. */
  accept: string;
  required: boolean;
}

export const BORROWER_DOCUMENTS: BorrowerDocument[] = [
  {
    type: "id_front",
    label: "ID (front)",
    hint: "A clear photo or scan of the front of your ID.",
    pdfOnly: false,
    extensions: PHOTO_OR_PDF,
    accept: ".pdf,image/*",
    required: true,
  },
  {
    type: "id_back",
    label: "ID (back)",
    hint: "The back of your ID card. Skip this for a green ID book.",
    pdfOnly: false,
    extensions: PHOTO_OR_PDF,
    accept: ".pdf,image/*",
    required: false,
  },
  {
    type: "bank_statement",
    label: "Bank statement",
    hint: "The PDF from your bank's app or email, covering the last three months. Photos and scans can't be checked.",
    pdfOnly: true,
    extensions: ["pdf"],
    accept: ".pdf,application/pdf",
    required: true,
  },
  {
    type: "payslip",
    label: "Payslip",
    hint: "Your latest payslip, if you have one.",
    pdfOnly: false,
    extensions: PHOTO_OR_PDF,
    accept: ".pdf,image/*",
    required: false,
  },
  {
    type: "selfie",
    label: "Selfie",
    hint: "A photo of your face, so we can match it to your ID.",
    pdfOnly: false,
    extensions: PHOTO_OR_PDF,
    accept: "image/*",
    required: false,
  },
];

/** Which document a stored file is, from the "<label> - <filename>" name the backend gives it. */
export function documentTypeOf(fileName: string): string | null {
  const labels: Record<string, string> = {
    "ID front": "id_front",
    "ID back": "id_back",
    "Bank statement": "bank_statement",
    Payslip: "payslip",
    "Proof of address": "proof_of_address",
    Selfie: "selfie",
  };
  const prefix = fileName.split(" - ")[0];
  return labels[prefix] ?? null;
}
