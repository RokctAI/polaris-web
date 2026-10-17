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


// The borrower's document checklist for one application: each document the
// lender may ask for, whether a file for it is already attached, and a
// picker that posts to the web app's upload route (app/api/lending/
// documents). Used on the last apply step and on /loans/[id].

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  BORROWER_DOCUMENTS,
  MAX_DOCUMENT_BYTES,
  documentTypeOf,
  type BorrowerDocument,
} from "./borrower-documents";

export function DocumentChecklist({
  loanApplication,
  uploadedFileNames,
  onChange,
}: {
  loanApplication: string;
  /** The `file_name` of each file already attached. */
  uploadedFileNames: string[];
  /** Called after a successful upload; the page refreshes otherwise. */
  onChange?: () => void;
}) {
  const uploaded = new Set(
    uploadedFileNames.map(documentTypeOf).filter(Boolean) as string[],
  );
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {BORROWER_DOCUMENTS.map((doc) => (
        <DocumentRow
          key={doc.type}
          doc={doc}
          loanApplication={loanApplication}
          attached={uploaded.has(doc.type)}
          onChange={onChange}
        />
      ))}
    </ul>
  );
}

function DocumentRow({
  doc,
  loanApplication,
  attached,
  onChange,
}: {
  doc: BorrowerDocument;
  loanApplication: string;
  attached: boolean;
  onChange?: () => void;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(attached);
  const [error, setError] = useState<string | null>(null);

  const send = async (file: File) => {
    setError(null);
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (doc.pdfOnly && extension !== "pdf") {
      setError("This must be the PDF from your bank. Photos and scans can't be accepted.");
      return;
    }
    if (file.size > MAX_DOCUMENT_BYTES) {
      setError("The file is too large. The most we take is 4 MB.");
      return;
    }
    setBusy(true);
    const form = new FormData();
    form.append("loan_application", loanApplication);
    form.append("document_type", doc.type);
    form.append("file", file);
    try {
      const res = await fetch("/api/lending/documents", { method: "POST", body: form });
      const answer = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !answer.ok) {
        setError(answer.error || "We could not save the file. Please try again.");
      } else {
        setDone(true);
        if (onChange) onChange();
        else router.refresh();
      }
    } catch {
      setError("The upload did not go through. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">
          {doc.label}
          {doc.required ? "" : <span className="font-normal text-muted-foreground"> (optional)</span>}
        </p>
        <p className="text-sm text-muted-foreground">{doc.hint}</p>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {done && <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Attached</span>}
        <input
          ref={input}
          type="file"
          accept={doc.accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void send(file);
          }}
        />
        <Button
          type="button"
          variant={done ? "outline" : "default"}
          size="sm"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          {busy ? "Uploading…" : done ? "Replace" : "Upload"}
        </Button>
      </div>
    </li>
  );
}
