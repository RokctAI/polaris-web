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


// POST /api/lending/documents: a borrower attaches a document to their own
// application from the web app (multipart: loan_application, document_type,
// file). A route handler rather than a server action because a server
// action's body is capped at 1 MB unless the shell raises it; this takes up
// to MAX_BYTES, which stays under the 4.5 MB request cap of a Vercel
// function. The backend (`api.lending.upload_application_document`) checks
// the application is the caller's own and refuses a bank statement that is
// not a PDF; the same rules are checked here first so the borrower gets a
// plain answer (Ray, 2026-10-17: a photo of a statement can be edited, only
// the bank's PDF can be checked).

import { NextResponse } from "next/server";

import { getPlatformSession } from "@/app/services/base/session";
import { BorrowerService } from "@/app/services/all/lending/borrower";
import {
  BORROWER_DOCUMENTS,
  MAX_DOCUMENT_BYTES,
} from "@/components/custom/lending/borrower-documents";

export const dynamic = "force-dynamic";

function refuse(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const session = await getPlatformSession();
  if (!session?.user) return refuse("Sign in again to upload.", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return refuse("The upload did not arrive. Please try again.");
  }

  const loanApplication = String(form.get("loan_application") ?? "");
  const documentType = String(form.get("document_type") ?? "");
  const file = form.get("file");
  const rule = BORROWER_DOCUMENTS.find((d) => d.type === documentType);
  if (!loanApplication || !rule) return refuse("Choose what you are uploading.");
  if (!(file instanceof File) || file.size === 0) return refuse("Choose a file.");
  if (file.size > MAX_DOCUMENT_BYTES) {
    return refuse("The file is too large. The most we take is 4 MB.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "";
  if (rule.pdfOnly) {
    const isPdf = extension === "pdf" && bytes.subarray(0, 5).toString("latin1") === "%PDF-";
    if (!isPdf) {
      return refuse(
        "A bank statement must be the PDF from your bank. Photos of statements can't be accepted.",
      );
    }
  } else if (!rule.extensions.includes(extension)) {
    return refuse("Upload a PDF or a photo (JPG, PNG, HEIC or WEBP).");
  }

  try {
    const saved = await BorrowerService.upload(
      loanApplication,
      documentType,
      file.name.slice(-120),
      bytes.toString("base64"),
    );
    return NextResponse.json({ ok: true, name: saved?.name ?? null });
  } catch (e) {
    console.error("[loans] document upload failed", e);
    return refuse("We could not save the file. Please try again.", 502);
  }
}
