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

"""Contract tests for the Polaris app download route and badges (1.8.0).

Run from the repository root:

    python3 -m unittest discover -s polaris/nextjs/tests -v

Ray, 2026-10-31: the Polaris app has no Play listing, so "do what you did
with supacharge-web" - the site resolves the latest RokctAI/polaris release
through the public releases API and 302s to the build. Mobile only ("polaris
wont have the web app downloadable only the mobile platforms"), and the
Huawei badge shows only when the release really carries a Huawei build (the
same rule for Android). The things that must never silently drift: which
asset each platform picks (the release build, never the debug build, the
.aab, the Windows installer or the other platform's APK), that Android falls
back to the releases page while Huawei never falls back, that every other
platform is refused, that a badge is drawn only for a build the release
carries (and none after a failed fetch), that the handler reads no token
and caches the API, and that no rendered string names a file format. The
resolver and the config are import-free and run here under node with types
stripped, as lms_sdk's tests/test_download_route.py does.
"""

import json
import os
import re
import shutil
import subprocess
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SDK_ROOT = os.path.abspath(os.path.join(HERE, os.pardir))
TEMPLATES = os.path.join(SDK_ROOT, "templates")
DOWNLOAD_DIR = os.path.join(TEMPLATES, "app", "download")
ROUTE_DIR = os.path.join(DOWNLOAD_DIR, "[platform]")
RESOLVE = os.path.join(ROUTE_DIR, "resolve.ts")
ROUTE = os.path.join(ROUTE_DIR, "route.ts")
RELEASE = os.path.join(DOWNLOAD_DIR, "release.ts")
AVAILABILITY_ROUTE = os.path.join(DOWNLOAD_DIR, "route.ts")
LANDING = os.path.join(TEMPLATES, "components", "custom", "landing")
CONFIG = os.path.join(LANDING, "polaris-landing-config.ts")
BADGES = os.path.join(LANDING, "polaris-store-badges.tsx")
HERO_FORM = os.path.join(LANDING, "polaris-hero-form.tsx")
CTA = os.path.join(TEMPLATES, "components", "custom", "polaris-cta-section.tsx")
FOOTER = os.path.join(TEMPLATES, "components", "custom", "polaris-footer-section.tsx")
MANIFEST = os.path.join(SDK_ROOT, "manifest.json")

RELEASES_PAGE = "https://github.com/RokctAI/polaris/releases/latest"
RELEASES_API = "https://api.github.com/repos/RokctAI/polaris/releases/latest"

# The v1.2.12 release as the API lists it (names real, 2026-10-31).
DOWNLOAD = "https://github.com/RokctAI/polaris/releases/download/v1.2.12/"


def asset(name, url=None):
    return {"name": name, "browser_download_url": url or DOWNLOAD + name}


V1212 = {
    "tag_name": "v1.2.12",
    "html_url": "https://github.com/RokctAI/polaris/releases/tag/v1.2.12",
    "draft": False,
    "prerelease": False,
    "assets": [
        asset("app-debug-v1.2.12.apk"),
        asset("app-v1.2.12.aab"),
        asset("app-v1.2.12.apk"),
        asset("polaris-windows-setup-v1.2.12.exe"),
        asset("update_package.zip"),
    ],
}

# The agreed name for a Huawei build in the same release.
HUAWEI = asset("app-huawei-v1.2.12.apk")


def with_assets(assets, **fields):
    release = dict(V1212, assets=assets)
    release.update(fields)
    return release


WITH_HUAWEI = with_assets(V1212["assets"] + [HUAWEI])
HUAWEI_ONLY = with_assets([HUAWEI])

DRIVER = """
import {
  POLARIS_DOWNLOAD_PLATFORMS, POLARIS_RELEASES_API, POLARIS_RELEASES_PAGE,
  availableDownloads, isDownloadPlatform, pickAssetUrl, resolveDownload,
} from "./resolve.ts";
import { POLARIS_LANDING_CONFIG, polarisShownStores } from "./config.ts";
const cases = JSON.parse(process.argv[2]);
const stores = POLARIS_LANDING_CONFIG.app.stores;
const out = {
  api: POLARIS_RELEASES_API,
  page: POLARIS_RELEASES_PAGE,
  platforms: Object.keys(POLARIS_DOWNLOAD_PLATFORMS),
  names: Object.fromEntries(Object.entries(POLARIS_DOWNLOAD_PLATFORMS).map(([k, v]) => [k, v.name])),
  stores,
  is: Object.fromEntries(cases.is.map((v) => [v, isDownloadPlatform(v)])),
  pick: cases.pick.map(([release, platform]) => pickAssetUrl(release, platform)),
  resolve: cases.resolve.map(([release, platform]) => resolveDownload(release, platform)),
  available: cases.available.map((release) => availableDownloads(release)),
  shown: cases.available.map((release) => polarisShownStores(stores, availableDownloads(release)).map((s) => s.id)),
  shownUnknown: polarisShownStores(stores, null).map((s) => s.id),
};
console.log(JSON.stringify(out));
"""


def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def code_of(path):
    """The source without comments, so a rule about code is not tripped by
    the prose that explains it."""
    source = re.sub(r"/\*.*?\*/", "", read(path), flags=re.S)
    return re.sub(r"(?m)(^|[^:])//.*$", r"\1", source)


def run_node(cases):
    node = shutil.which("node")
    if not node:
        raise unittest.SkipTest("node is not installed")
    with tempfile.TemporaryDirectory() as tmp:
        shutil.copy(RESOLVE, os.path.join(tmp, "resolve.ts"))
        shutil.copy(CONFIG, os.path.join(tmp, "config.ts"))
        driver = os.path.join(tmp, "driver.ts")
        with open(driver, "w", encoding="utf-8") as f:
            f.write(DRIVER)
        run = subprocess.run(
            [node, "--experimental-strip-types", "--no-warnings", driver, json.dumps(cases)],
            capture_output=True, text=True, timeout=60, cwd=tmp,
        )
    if run.returncode != 0:
        raise AssertionError(run.stderr)
    return json.loads(run.stdout.strip().splitlines()[-1])


class TestResolver(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        shuffled = with_assets(list(reversed(WITH_HUAWEI["assets"])))
        cls.out = run_node({
            "is": ["android", "huawei", "ios", "windows", "desktop", "web", "", "constructor", "__proto__", "Android"],
            "pick": [
                [V1212, "android"],                                       # 0
                [shuffled, "android"],                                    # 1
                [with_assets(V1212["assets"][:2]), "android"],            # 2 debug + aab only
                [V1212, "huawei"],                                        # 3 no Huawei build
                [WITH_HUAWEI, "huawei"],                                  # 4
                [shuffled, "huawei"],                                     # 5
                [HUAWEI_ONLY, "android"],                                 # 6 Huawei APK is not Android's
                [with_assets(V1212["assets"], draft=True), "android"],    # 7
                [with_assets(WITH_HUAWEI["assets"], prerelease=True), "huawei"],  # 8
                [with_assets([asset("app-v1.2.12.apk", "http://insecure/app.apk")]), "android"],  # 9
                [with_assets([{"name": "app-v1.2.12.apk"}, None, "junk"]), "android"],  # 10
                [with_assets("not a list"), "android"],                   # 11
                [None, "android"],                                        # 12
                ["a string", "huawei"],                                   # 13
                [with_assets([asset("app-v2.0.0-rc.1.apk")]), "android"],  # 14
                [with_assets([asset("app-huawei-v1.2.12.apk", "http://insecure/h.apk")]), "huawei"],  # 15
            ],
            "resolve": [
                [V1212, "android"],                                       # 0
                [WITH_HUAWEI, "huawei"],                                  # 1
                [V1212, "huawei"],                                        # 2 no Huawei: null (404)
                [None, "huawei"],                                         # 3 failed fetch: null
                [with_assets([]), "android"],                             # 4
                [{"html_url": "http://not-https/tag/v9", "assets": []}, "android"],  # 5
                [None, "android"],                                        # 6
                [{"message": "API rate limit exceeded"}, "android"],      # 7
            ],
            "available": [
                V1212,                                                    # 0 today's release
                WITH_HUAWEI,                                              # 1
                HUAWEI_ONLY,                                              # 2
                with_assets(V1212["assets"][:2] + V1212["assets"][3:]),   # 3 no app-v*.apk
                None,                                                     # 4 failed fetch
                {"message": "API rate limit exceeded"},                   # 5
                with_assets(WITH_HUAWEI["assets"], draft=True),           # 6
            ],
        })

    def test_constants_name_the_public_polaris_api_and_page(self):
        self.assertEqual(self.out["api"], RELEASES_API)
        self.assertEqual(self.out["page"], RELEASES_PAGE)

    def test_mobile_platforms_only(self):
        self.assertEqual(self.out["platforms"], ["android", "huawei"])
        self.assertEqual(self.out["names"], {"android": "Android", "huawei": "Huawei"})
        self.assertEqual(
            self.out["is"],
            {"android": True, "huawei": True, "ios": False, "windows": False, "desktop": False,
             "web": False, "": False, "constructor": False, "__proto__": False, "Android": False},
        )

    def test_android_picks_the_release_apk_whatever_the_order(self):
        pick = self.out["pick"]
        self.assertEqual(pick[0], DOWNLOAD + "app-v1.2.12.apk")
        self.assertEqual(pick[1], DOWNLOAD + "app-v1.2.12.apk", "debug or Huawei build listed first must not win")
        self.assertIsNone(pick[2], "only app-debug and the .aab: no Android download")
        self.assertIsNone(pick[6], "the Huawei APK is never the Android download")
        self.assertEqual(pick[14], DOWNLOAD + "app-v2.0.0-rc.1.apk")

    def test_huawei_picks_only_the_huawei_apk(self):
        pick = self.out["pick"]
        self.assertIsNone(pick[3], "no Huawei build: nothing, never the Android APK")
        self.assertEqual(pick[4], DOWNLOAD + "app-huawei-v1.2.12.apk")
        self.assertEqual(pick[5], DOWNLOAD + "app-huawei-v1.2.12.apk")
        self.assertIsNone(pick[15], "a non-https Huawei url")

    def test_unpublished_releases_and_broken_answers_pick_nothing(self):
        pick = self.out["pick"]
        for index, why in ((7, "draft"), (8, "prerelease"), (9, "non-https url"),
                           (10, "assets without a url"), (11, "assets not a list"),
                           (12, "no release"), (13, "release not an object")):
            self.assertIsNone(pick[index], why)

    def test_android_falls_back_to_the_page_and_huawei_never_does(self):
        resolve = self.out["resolve"]
        self.assertEqual(resolve[0], {"url": DOWNLOAD + "app-v1.2.12.apk", "direct": True})
        self.assertEqual(resolve[1], {"url": DOWNLOAD + "app-huawei-v1.2.12.apk", "direct": True})
        self.assertIsNone(resolve[2], "no Huawei build: the route's 404")
        self.assertIsNone(resolve[3], "failed fetch: the route's 404 for Huawei")
        self.assertEqual(resolve[4], {"url": V1212["html_url"], "direct": False})
        self.assertEqual(resolve[5], {"url": RELEASES_PAGE, "direct": False})
        self.assertEqual(resolve[6], {"url": RELEASES_PAGE, "direct": False})
        self.assertEqual(resolve[7], {"url": RELEASES_PAGE, "direct": False})

    def test_availability_follows_the_real_assets(self):
        available = self.out["available"]
        self.assertEqual(available[0], {"android": True, "huawei": False})
        self.assertEqual(available[1], {"android": True, "huawei": True})
        self.assertEqual(available[2], {"android": False, "huawei": True})
        self.assertEqual(available[3], {"android": False, "huawei": False})
        self.assertEqual(available[4], {"android": False, "huawei": False}, "failed fetch")
        self.assertEqual(available[5], {"android": False, "huawei": False}, "rate limited")
        self.assertEqual(available[6], {"android": False, "huawei": False}, "draft")

    def test_badges_shown_and_hidden_by_the_release(self):
        shown = self.out["shown"]
        self.assertEqual(shown[0], ["android"], "today's release: Android only, no Huawei badge")
        self.assertEqual(shown[1], ["android", "huawei"], "a Huawei build: both badges")
        self.assertEqual(shown[2], ["huawei"], "no Android APK: no Android badge")
        self.assertEqual(shown[3], [], "neither build: nothing")
        self.assertEqual(shown[4], [], "failed fetch: nothing")
        self.assertEqual(shown[5], [], "rate limited: nothing")
        self.assertEqual(shown[6], [], "unpublished release: nothing")
        self.assertEqual(self.out["shownUnknown"], [], "before the hero hears back: nothing")

    def test_config_links_the_route_and_keeps_ios_disabled(self):
        stores = {s["id"]: s for s in self.out["stores"]}
        self.assertEqual(list(stores), ["android", "huawei", "app-store"])
        self.assertEqual(stores["android"]["href"], "/download/android")
        self.assertEqual((stores["android"]["eyebrow"], stores["android"]["label"]), ("Download for", "Android"))
        self.assertEqual(stores["android"]["release"], "android")
        self.assertEqual(stores["huawei"]["href"], "/download/huawei")
        self.assertEqual(stores["huawei"]["release"], "huawei")
        self.assertFalse(stores["app-store"]["enabled"])
        self.assertEqual(stores["app-store"]["href"], "")
        for store in self.out["stores"]:
            if store["enabled"]:
                match = re.fullmatch(r"/download/([a-z]+)", store["href"])
                self.assertIsNotNone(match, store["href"])
                self.assertIn(match.group(1), self.out["platforms"])
                self.assertEqual(store["release"], match.group(1))


class TestNoFileFormatOrStoreInTheCopy(unittest.TestCase):
    def test_no_rendered_string_says_apk(self):
        """The badges name the platform, never a file format."""
        out = run_node({"is": [], "pick": [], "resolve": [], "available": []})
        for store in out["stores"]:
            for field in ("eyebrow", "label", "href"):
                self.assertNotRegex(store[field], r"(?i)apk", field)
        for path in (CONFIG, BADGES, HERO_FORM, CTA, FOOTER):
            strings = re.findall(r'"([^"\n]*)"|>([^<>{}\n]+)<', code_of(path))
            for text in ("".join(pair) for pair in strings):
                self.assertNotRegex(text, r"(?i)apk", "%s: %r" % (os.path.basename(path), text))

    def test_the_play_listing_is_gone(self):
        for path in (CONFIG, BADGES):
            source = read(path)
            self.assertNotIn("play.google.com", source)
            self.assertNotIn("Google Play", code_of(path))
            self.assertNotIn("com.loans.app", source)


class TestRouteHandler(unittest.TestCase):
    def setUp(self):
        self.route = code_of(ROUTE)
        self.release = code_of(RELEASE)

    def test_files_are_installed(self):
        manifest = json.loads(read(MANIFEST))
        installs = {e["to"]: e["from"] for e in manifest["app_type"]["polaris"]["installs"]}
        for host in ("app/download/route.ts", "app/download/release.ts",
                     "app/download/[platform]/route.ts", "app/download/[platform]/resolve.ts"):
            self.assertIn(host, installs)
            self.assertTrue(os.path.isfile(os.path.join(SDK_ROOT, installs[host])))

    def test_fetch_reads_no_token_and_caches_ten_minutes(self):
        for source in (self.route, self.release, code_of(AVAILABILITY_ROUTE)):
            self.assertNotIn("process.env", source)
            self.assertNotRegex(source, r"(?i)authorization|token|secret")
            self.assertNotIn("api.github.com", source, "the URL lives in resolve.ts")
        self.assertIn("POLARIS_RELEASE_REVALIDATE_SECONDS = 600", self.release)
        self.assertIn("next: { revalidate: POLARIS_RELEASE_REVALIDATE_SECONDS }", self.release)
        self.assertIn("POLARIS_RELEASES_API", self.release)

    def test_handler_redirects_302_refuses_unknown_and_missing_and_ignores_prefetches(self):
        self.assertIn("status: 302", self.route)
        self.assertEqual(self.route.count("status: 404"), 2, "unknown platform, and no build for Huawei")
        self.assertIn("status: 204", self.route)
        self.assertIn("isDownloadPlatform(platform)", self.route)
        self.assertIn("resolveDownload(release, platform)", self.route)
        self.assertIn("fetchLatestPolarisRelease()", self.route)
        for header in ("next-router-prefetch", "rsc", "purpose"):
            self.assertIn('"%s"' % header, self.route)

    def test_resolver_and_config_import_nothing(self):
        for path in (RESOLVE, CONFIG):
            self.assertNotRegex(code_of(path), r"(?m)^\s*import\s", "%s must stay import-free" % path)
            self.assertNotIn("process.env", read(path))

    def test_every_surface_gates_the_badges_on_the_release(self):
        for path in (CTA, FOOTER):
            source = code_of(path)
            self.assertIn("await", source)
            self.assertIn("fetchPolarisDownloadAvailability", source)
            self.assertIn("<PolarisStoreBadges available={available}", source)
        hero = code_of(HERO_FORM)
        self.assertIn('fetch("/download"', hero)
        self.assertIn("<PolarisStoreBadges available={available}", hero)
        self.assertNotIn("app/download/release", hero, "the client never imports the server fetch")
        badges = code_of(BADGES)
        self.assertIn("polarisShownStores(POLARIS_LANDING_CONFIG.app.stores, available)", badges)
        self.assertNotIn('target="_blank"', badges)


if __name__ == "__main__":
    unittest.main()
