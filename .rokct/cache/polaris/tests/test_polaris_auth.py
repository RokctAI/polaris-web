# Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, version 3.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

"""polaris_sdk 1.10.0: the Polaris auth pages. The polaris block installs
its own components/custom/site-shell.tsx (auth_sdk >= 1.12.0's SiteShell
seam) with the SiteShell / SiteShellLogo contract, client-safe, wearing the
landing's theme, with scoped CSS and copy that only repeats the landing."""

import json
import re
import unittest
from pathlib import Path

SDK = Path(__file__).resolve().parents[1]
T = SDK / "templates/components/custom"
SHELL = T / "site-shell.tsx"
COPY = T / "polaris-auth/polaris-auth-copy.ts"
CSS = T / "polaris-auth/polaris-auth.css"


class PolarisAuthTest(unittest.TestCase):
    def test_manifest_installs_the_shell(self):
        m = json.loads((SDK / "manifest.json").read_text())
        pairs = {(i["from"], i["to"]) for i in m["app_type"]["polaris"]["installs"]}
        self.assertIn(("templates/components/custom/site-shell.tsx", "components/custom/site-shell.tsx"), pairs)
        self.assertIn(("templates/components/custom/polaris-auth", "components/custom/polaris-auth"), pairs)

    def test_contract(self):
        src = SHELL.read_text()
        self.assertIn('"use client";', src)
        self.assertIn("export interface SiteShellProps", src)
        self.assertIn("export function SiteShell(", src)
        self.assertIn("export function SiteShellLogo(", src)
        self.assertIn("<PolarisTheme />", src)
        self.assertIn("polarisBrandName()", src)
        self.assertNotRegex(src, r"server-only|next/headers|polaris-footer-section")
        # Ray: no oversized brand name at the bottom of any site.
        self.assertNotIn("px-footer-mark", src)

    def test_css_scoped(self):
        body = re.sub(r"/\*.*?\*/", "", CSS.read_text(), flags=re.S)
        for sel in re.findall(r"([^{}]+)\{", body):
            if sel.strip().startswith("@media"):
                continue
            for part in sel.split(","):
                self.assertRegex(part.strip(), r"^\.pa-root \.pa", part)

    def test_copy_is_the_landings(self):
        src = COPY.read_text()
        cfg = (T / "landing/polaris-landing-config.ts").read_text()
        self.assertIn("full cost", cfg)
        self.assertIn("Apply, upload, sign and follow your loan", cfg)
        for word in ("instant", "quick cash", "payday", "approved in"):
            self.assertNotIn(word, src.lower())


if __name__ == "__main__":
    unittest.main()
