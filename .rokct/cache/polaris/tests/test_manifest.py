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

"""Contract tests for polaris/nextjs's manifest and its landing.

Run from the repository root:

    python3 -m unittest discover -s polaris/nextjs/tests -v

The `app_type.polaris` block is the Polaris web app's landing (Ray,
2026-10-18: "redesign this landing page ... give it a loan calculator").
The things that must never silently drift: every install source exists;
every module a base_sdk registry imports in the SERVER render is
server-safe (no "use client" - the hero form, which the hero renders on
the client, is the one exception); every page section exports a `meta`
with its place in the page; every host file the landing imports is
declared in `requires`; the calculator's maths runs on the SDK's own NCR
engine; the footer advertises the manifest's version; and the copy
carries no placeholder. Stdlib only, the shape corporate/nextjs's
tests/test_manifest.py takes.
"""

import json
import os
import re
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SDK_ROOT = os.path.abspath(os.path.join(HERE, os.pardir))
MANIFEST = os.path.join(SDK_ROOT, "manifest.json")
CHANGELOG = os.path.join(SDK_ROOT, "CHANGELOG.md")
TEMPLATES = os.path.join(SDK_ROOT, "templates")
LANDING = os.path.join(TEMPLATES, "components", "custom", "landing")
PRESETS = os.path.join(LANDING, "polaris-loan-presets.ts")
FOOTER_CHROME = os.path.join(LANDING, "polaris-footer-chrome.ts")
COPY = os.path.join(LANDING, "polaris-landing-config.ts")
THEME_SECTION = os.path.join(TEMPLATES, "components", "custom", "polaris-theme-section.tsx")
FOOTER_SECTION = os.path.join(TEMPLATES, "components", "custom", "polaris-footer-section.tsx")

PAGE_SECTIONS_TARGET = "components/custom/landing/page-sections.ts"
HERO_FORM_TARGET = "components/custom/landing/hero-form.ts"

ALIAS_IMPORT = re.compile(r"""from\s+["']@/([^"']+)["']""")
REPLACEMENT_IMPORT = re.compile(r"""import\(["']@/([^"']+)["']\)""")
PLACEHOLDER = re.compile(r"\[\[|TODO|lorem ipsum|\{\{", re.IGNORECASE)


def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def is_client_module(source):
    """Whether the module's first statement is the "use client" directive:
    the licence block and any leading line comments are skipped first, so a
    comment that mentions the directive does not count."""
    rest = source.lstrip()
    while True:
        if rest.startswith("/*"):
            end = rest.find("*/")
            rest = rest[end + 2:].lstrip() if end >= 0 else ""
        elif rest.startswith("//"):
            newline = rest.find("\n")
            rest = rest[newline + 1:].lstrip() if newline >= 0 else ""
        else:
            break
    return rest.startswith('"use client"') or rest.startswith("'use client'")


class ManifestContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads(read(MANIFEST))
        cls.block = cls.manifest["app_type"]["polaris"]
        cls.installed = {}  # host path -> template source path
        for entry in cls.manifest["installs"] + cls.block["installs"]:
            cls.installed[entry["to"]] = os.path.join(SDK_ROOT, entry["from"])
        cls.requires = set(cls.manifest.get("requires", [])) | set(cls.block.get("requires", []))

    def source_for_host_path(self, host_path):
        """The template file an installed host path (without extension) comes
        from: a file install by name, or the matching file under a directory
        install (the top-level block installs whole directories)."""
        for candidate in (host_path + ".ts", host_path + ".tsx", host_path):
            if candidate in self.installed:
                return self.installed[candidate]
        for to, source in self.installed.items():
            if host_path.startswith(to + "/") and os.path.isdir(source):
                for candidate in (".ts", ".tsx", ""):
                    path = os.path.join(source, host_path[len(to) + 1:] + candidate)
                    if os.path.isfile(path):
                        return path
        return None

    def installs_host_path(self, host_path):
        """Whether this SDK writes `host_path` (without extension) itself."""
        return self.source_for_host_path(host_path) is not None

    def test_version_matches_changelog(self):
        version = self.manifest["version"]
        self.assertRegex(version, r"^\d+\.\d+\.\d+$")
        self.assertIn("## %s\n" % version, read(CHANGELOG))

    def test_every_install_source_exists(self):
        for entry in self.manifest["installs"] + self.block["installs"]:
            path = os.path.join(SDK_ROOT, entry["from"])
            self.assertTrue(os.path.exists(path), "missing install source: %s" % entry["from"])

    def test_every_landing_template_is_installed(self):
        sources = {os.path.relpath(p, SDK_ROOT) for p in self.installed.values()}
        for name in os.listdir(LANDING):
            rel = os.path.relpath(os.path.join(LANDING, name), SDK_ROOT)
            self.assertIn(rel, sources, "%s is in templates but no install names it" % rel)

    def test_integration_ids_are_unique(self):
        ids = [re.search(r'id: "([^"]+)"', i["replacement"]).group(1) for i in self.block["integrations"]]
        self.assertEqual(len(ids), len(set(ids)), "duplicate registry ids: %s" % ids)

    def test_registry_entry_modules_are_installed_and_server_safe(self):
        for integration in self.block["integrations"]:
            match = REPLACEMENT_IMPORT.search(integration["replacement"])
            self.assertIsNotNone(match, integration["replacement"])
            source = self.source_for_host_path(match.group(1))
            self.assertIsNotNone(source, "%s is registered but not installed" % match.group(1))
            if integration["target"] == HERO_FORM_TARGET:
                self.assertTrue(is_client_module(read(source)), "the hero form holds the calculator's state")
                continue
            self.assertFalse(
                is_client_module(read(source)),
                "%s is imported in base's server render and must not be a client module" % source,
            )

    def test_every_page_section_exports_meta_with_an_order(self):
        for integration in self.block["integrations"]:
            if integration["target"] != PAGE_SECTIONS_TARGET:
                continue
            source = read(self.source_for_host_path(REPLACEMENT_IMPORT.search(integration["replacement"]).group(1)))
            self.assertIn("export const meta: PageSectionMeta", source)
            self.assertRegex(source, r"order:\s*-?\d+")
            self.assertIn("export default function", source)

    def test_theme_and_footer_are_frame_sections(self):
        theme = read(THEME_SECTION)
        self.assertIn("rootClass: POLARIS_ROOT_CLASS", theme)
        self.assertIn("frame: true", theme)
        self.assertRegex(theme, r"order:\s*-\d+")
        footer = read(FOOTER_SECTION)
        self.assertIn("frame: true", footer)
        self.assertIn("listPublicTerms", footer)
        self.assertIn("legalFooterLinks", footer)

    def test_client_halves_are_never_registry_entries(self):
        registered = set()
        for integration in self.block["integrations"]:
            if integration["target"] == HERO_FORM_TARGET:
                continue
            registered.add(self.source_for_host_path(REPLACEMENT_IMPORT.search(integration["replacement"]).group(1)))
        for entry in self.block["installs"]:
            path = os.path.join(SDK_ROOT, entry["from"])
            if path.endswith(".css"):
                continue
            if is_client_module(read(path)):
                self.assertNotIn(path, registered, "%s is a client module registered in a server registry" % entry["from"])

    def test_every_host_import_is_declared_in_requires(self):
        for entry in self.block["installs"]:
            path = os.path.join(SDK_ROOT, entry["from"])
            if path.endswith(".css"):
                continue
            for host_path in ALIAS_IMPORT.findall(read(path)):
                if self.installs_host_path(host_path):
                    continue
                candidates = {host_path, host_path + ".ts", host_path + ".tsx"}
                self.assertTrue(
                    candidates & self.requires,
                    "%s imports @/%s, which neither this SDK installs nor requires names" % (entry["from"], host_path),
                )

    def test_calculator_runs_on_the_sdk_ncr_engine(self):
        source = read(PRESETS)
        match = re.search(r"""from\s+["'](\.\./[^"']+ncr_calculator)["']""", source)
        self.assertIsNotNone(match, "the presets must import the SDK's own NCR engine by a relative path")
        engine = os.path.normpath(os.path.join(LANDING, match.group(1) + ".ts"))
        self.assertTrue(os.path.exists(engine), engine)
        self.assertTrue(self.installs_host_path("app/lib/lending/ncr_calculator"))
        for cap in ("NCR_MAX_INTEREST_RATE_SHORT_TERM", "NCR_MAX_SERVICE_FEE_PM", "NCR_VAT_RATE"):
            self.assertIn(cap, source)
        self.assertNotIn("framer-motion", read(os.path.join(LANDING, "polaris-loan-calculator.tsx")))

    def test_footer_advertises_the_manifest_version(self):
        self.assertIn('POLARIS_LANDING_VERSION = "%s"' % self.manifest["version"], read(FOOTER_CHROME))

    def test_copy_carries_no_placeholder_and_no_slug(self):
        copy = read(COPY)
        self.assertIsNone(PLACEHOLDER.search(copy), "placeholder text in the landing copy")
        self.assertNotIn("polaris-web", copy)
        metadata = read(os.path.join(LANDING, "polaris-site-metadata.ts"))
        self.assertIn("POLARIS_BRAND_NAME", metadata)
        self.assertNotIn("PLATFORM_NAME", metadata)


if __name__ == "__main__":
    unittest.main()
