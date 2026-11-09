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

// polaris_sdk 1.10.0: the words beside the auth card (../site-shell.tsx).
// Every claim is the landing's own (polaris-landing-config.ts): the full
// cost before you apply, the four steps online, the saved application. The
// card's own words stay auth_sdk's.

export interface PolarisAuthPanel {
  kicker: string;
  title: string[];
  lede: string;
}

export const POLARIS_AUTH_COPY = {
  login: {
    kicker: "Sign in",
    title: ["Welcome", "back."],
    lede: "Sign in to your {name} account to carry on.",
  },
  register: {
    kicker: "New account",
    title: ["The full cost,", "before you apply."],
    lede: "Create a {name} account to get started.",
  },
  forgot: {
    kicker: "Account help",
    title: ["Lost your", "password?"],
    lede: "Password reset is not self-service yet. Get in touch with us and we will help you back in.",
  },
  points: [
    "The full cost shown before you apply",
    "Apply, upload, sign and follow your loan online",
    "Every step saves your application",
  ],
} as const;

/** The panel for the auth page at `pathname` (login when unknown), naming the shell's brand. */
export function polarisAuthPanel(pathname: string | null, name: string): PolarisAuthPanel {
  const p = pathname ?? "";
  const c = p.startsWith("/register") ? POLARIS_AUTH_COPY.register : p.startsWith("/forgot") ? POLARIS_AUTH_COPY.forgot : POLARIS_AUTH_COPY.login;
  return { kicker: `${name} · ${c.kicker}`, title: [...c.title], lede: c.lede.replace("{name}", name) };
}
