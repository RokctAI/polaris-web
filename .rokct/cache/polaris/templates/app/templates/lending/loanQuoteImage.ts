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

// Renders the loan quote (get_loan_quote) as a 1080x1350 PNG in the same
// look as the decision notice, so a lender can send it before the applicant
// commits.

import {
  COLORS,
  FONT,
  H,
  PAD,
  W,
  drawLines,
  loadBrandFonts,
  shareImage,
  wrap,
} from "./decisionNoticeImage";

export interface LoanQuote {
  headline: string;
  total: string;
  total_label: string;
  lines: { label: string; amount: string }[];
  footer: string;
  date: string;
}

export async function renderLoanQuotePng(
  quote: LoanQuote,
  brand = "Polaris",
): Promise<Blob> {
  await loadBrandFonts();

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "top";
  const width = W - PAD * 2;

  ctx.fillStyle = COLORS.ink;
  ctx.font = `italic 900 76px ${FONT}`;
  ctx.fillText(brand, PAD, 96);

  ctx.fillStyle = COLORS.muted;
  ctx.font = `600 28px ${FONT}`;
  ctx.fillText(`Loan quote · ${quote.date}`, PAD, 196);

  ctx.fillStyle = COLORS.ink;
  ctx.font = `700 62px ${FONT}`;
  let y = drawLines(ctx, quote.headline, PAD, 270, width, 72) + 40;

  ctx.fillStyle = COLORS.accent;
  ctx.font = `700 96px ${FONT}`;
  ctx.fillText(quote.total, PAD, y);
  y += 110;
  ctx.fillStyle = COLORS.muted;
  ctx.font = `600 32px ${FONT}`;
  y = drawLines(ctx, quote.total_label, PAD, y, width, 42) + 40;

  ctx.fillStyle = COLORS.line;
  ctx.fillRect(PAD, y, width, 2);
  y += 40;

  quote.lines.forEach((line, i) => {
    const isTotal = i === quote.lines.length - 1;
    if (isTotal) {
      ctx.fillStyle = COLORS.line;
      ctx.fillRect(PAD, y, width, 2);
      y += 24;
    }
    ctx.font = `${isTotal ? 700 : 500} 36px ${FONT}`;
    ctx.fillStyle = isTotal ? COLORS.ink : COLORS.muted;
    ctx.textAlign = "left";
    ctx.fillText(line.label, PAD, y);
    ctx.fillStyle = COLORS.ink;
    ctx.textAlign = "right";
    ctx.fillText(line.amount, W - PAD, y);
    ctx.textAlign = "left";
    y += 66;
  });

  ctx.fillStyle = COLORS.muted;
  ctx.font = `500 24px ${FONT}`;
  const footLines = wrap(ctx, quote.footer, width);
  drawLines(ctx, quote.footer, PAD, H - 80 - footLines.length * 35, width, 35);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image failed"))),
      "image/png",
    ),
  );
}

// Share straight to WhatsApp where the device can share files; otherwise
// download the PNG.
// With an acceptance link, the link travels as the share text so a client
// without the app can tap it and accept.
export async function shareLoanQuote(
  quote: LoanQuote,
  fileName: string,
  acceptUrl?: string,
) {
  const text = acceptUrl
    ? `Your loan quote. Tap to accept: ${acceptUrl}`
    : undefined;
  return shareImage(
    await renderLoanQuotePng(quote),
    fileName,
    quote.headline,
    text,
  );
}
