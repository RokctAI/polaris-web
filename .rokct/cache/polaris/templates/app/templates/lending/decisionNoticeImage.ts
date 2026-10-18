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

// Renders the decision engine's applicant notice (get_credit_score ->
// result.notice) as a 1080x1350 PNG: the 4:5 portrait size WhatsApp shows
// uncropped. Drawn on a canvas in the browser, so no server round trip.

export interface DecisionNotice {
  decision: string;
  status: string;
  headline: string;
  reasons: string[];
  reapply: string[];
  footer: string;
  date: string;
}

export const W = 1080;
export const H = 1350;
export const PAD = 88;
export const COLORS = {
  bg: "#0f1a2e",
  ink: "#f1f4f9",
  muted: "#a9b8cf",
  line: "#24365a",
  accent: "#f2c94c",
  declined: "#ff8a7a",
  approved: "#6fdc9a",
  review: "#f2c94c",
};
export const FONT = "Montserrat, 'Helvetica Neue', Arial, sans-serif";

export function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  for (const line of wrap(ctx, text, maxWidth)) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

export async function renderDecisionNoticePng(
  notice: DecisionNotice,
  brand = "Polaris",
): Promise<Blob> {
  // Use the Supacharge logo face when the page can load it; the stack falls
  // back to a system sans otherwise.
  try {
    await Promise.all([
      document.fonts.load(`italic 900 76px Montserrat`),
      document.fonts.load(`700 62px Montserrat`),
      document.fonts.load(`500 36px Montserrat`),
    ]);
  } catch {
    /* fallback fonts are fine */
  }

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
  ctx.fillText(`Loan decision · ${notice.date}`, PAD, 196);

  ctx.fillStyle = COLORS.ink;
  ctx.font = `700 62px ${FONT}`;
  let y = drawLines(ctx, notice.headline, PAD, 270, width, 72) + 30;

  const statusColor =
    notice.decision === "Approve"
      ? COLORS.approved
      : notice.decision === "Decline"
        ? COLORS.declined
        : COLORS.review;
  ctx.font = `700 32px ${FONT}`;
  const pill = ctx.measureText(notice.status).width + 60;
  ctx.strokeStyle = statusColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(PAD, y, pill, 66, 33);
  ctx.stroke();
  ctx.fillStyle = statusColor;
  ctx.fillText(notice.status, PAD + 30, y + 16);
  y += 66 + 56;

  ctx.font = `500 36px ${FONT}`;
  for (const reason of notice.reasons) {
    ctx.fillStyle = COLORS.accent;
    ctx.beginPath();
    ctx.arc(PAD + 7, y + 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.ink;
    y = drawLines(ctx, reason, PAD + 40, y, width - 40, 50) + 24;
  }

  if (notice.reapply.length) {
    y += 16;
    ctx.fillStyle = COLORS.line;
    ctx.fillRect(PAD, y, width, 2);
    y += 40;
    ctx.fillStyle = COLORS.muted;
    ctx.font = `700 26px ${FONT}`;
    ctx.fillText("YOU CAN APPLY AGAIN WHEN", PAD, y);
    y += 48;
    ctx.fillStyle = COLORS.ink;
    ctx.font = `500 34px ${FONT}`;
    const text = notice.reapply.join(", and ");
    drawLines(ctx, text.charAt(0).toUpperCase() + text.slice(1) + ".", PAD, y, width, 48);
  }

  ctx.fillStyle = COLORS.muted;
  ctx.font = `500 24px ${FONT}`;
  const footLines = wrap(ctx, notice.footer, width);
  drawLines(ctx, notice.footer, PAD, H - 80 - footLines.length * 35, width, 35);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image failed"))),
      "image/png",
    ),
  );
}

// Share straight to WhatsApp where the device supports sharing files
// (phones); otherwise download the PNG.
export async function shareDecisionNotice(notice: DecisionNotice, fileName: string) {
  const blob = await renderDecisionNoticePng(notice);
  return shareImage(blob, fileName, notice.headline);
}

// Load the Supacharge logo face when the page can; the stack falls back to a
// system sans otherwise.
export async function loadBrandFonts() {
  try {
    await Promise.all([
      document.fonts.load(`italic 900 76px Montserrat`),
      document.fonts.load(`700 62px Montserrat`),
      document.fonts.load(`500 36px Montserrat`),
    ]);
  } catch {
    /* fallback fonts are fine */
  }
}

export async function shareImage(
  blob: Blob,
  fileName: string,
  title: string,
  text?: string,
) {
  const file = new File([blob], `${fileName}.png`, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title, ...(text ? { text } : {}) });
    return "shared";
  }
  // Desktop: the image downloads; any accompanying text (e.g. an acceptance
  // link) goes to the clipboard so it can be pasted next to it.
  if (text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard blocked: the image still downloads */
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
  return "downloaded";
}
