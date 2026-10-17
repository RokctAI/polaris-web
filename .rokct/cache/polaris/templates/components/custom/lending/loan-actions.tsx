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


// The answers a borrower gives on /loans/[id]: accept or decline the
// contract, ask for the payout, cancel an undecided application. Each asks
// once more before it acts, because none can be taken back.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  acceptContract,
  cancelApplication,
  declineContract,
  requestPayout,
} from "@/app/actions/lending/borrower";

type Action = "accept" | "decline" | "payout" | "cancel";

const ACTIONS: Record<Action, { label: string; confirm: string; run: (id: string) => ReturnType<typeof acceptContract> }> = {
  accept: {
    label: "Accept the contract",
    confirm: "Accept this contract? Once accepted, the loan is paid out to you.",
    run: acceptContract,
  },
  decline: {
    label: "Decline",
    confirm: "Decline this contract? The offer closes and you would need to apply again.",
    run: declineContract,
  },
  payout: {
    label: "Request payout",
    confirm: "Ask us to pay the money out to you?",
    run: requestPayout,
  },
  cancel: {
    label: "Cancel application",
    confirm: "Cancel this application? You would need to apply again.",
    run: cancelApplication,
  },
};

export function LoanActions({ loanApplication, actions }: { loanApplication: string; actions: Action[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (actions.length === 0) return null;

  const run = async (action: Action) => {
    if (!window.confirm(ACTIONS[action].confirm)) return;
    setError(null);
    setBusy(action);
    const result = await ACTIONS[action].run(loanApplication);
    setBusy(null);
    if (!result.ok) setError(result.error);
    else router.refresh();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <Button
            key={action}
            variant={action === "accept" || action === "payout" ? "default" : "outline"}
            disabled={busy !== null}
            onClick={() => run(action)}
          >
            {busy === action ? "Working…" : ACTIONS[action].label}
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
