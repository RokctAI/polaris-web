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


// The "Get the app" badges: one pill per platform the landing config's
// `app` block enables, drawn in the house style (the ink pill, the
// platform's mark at the left, the two-line label) rather than any store's
// badge artwork. Since the app has no store listing, the Android and Huawei
// badges read "Download for" over the platform's name and link the site's
// own /download/<platform> route (app/download/[platform]/route.ts), which
// redirects to the latest release's build; the wording names the platform,
// never a file format. A badge tied to a release build is drawn only when
// `available` says the latest release carries it: the close and the footer
// pass the server's answer (app/download/release.ts), the client hero the
// answer it read from /download. With nothing to draw it draws
// nothing at all, label included. Hook-free, so the client hero and the
// server sections can both draw it.
//
// The marks: Android and Huawei are Simple Icons' drawings (simple-icons
// 13.21.0, CC0-1.0; the trademarks stay their owners'), one path each in
// currentColor so the pill's ink sets their colour; iOS is a plain phone
// outline, no store's logo, and its slot is disabled anyway.

import React from "react";

import {
  POLARIS_LANDING_CONFIG,
  polarisShownStores,
  type PolarisAppAvailability,
  type PolarisStoreLink,
} from "./polaris-landing-config";

/** Simple Icons "android" (CC0-1.0). */
const ANDROID_MARK =
  "M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z";

/** Simple Icons "huawei" (CC0-1.0). */
const HUAWEI_MARK =
  "M3.67 6.14S1.82 7.91 1.72 9.78v.35c.08 1.51 1.22 2.4 1.22 2.4 1.83 1.79 6.26 4.04 7.3 4.55 0 0 .06.03.1-.01l.02-.04v-.04C7.52 10.8 3.67 6.14 3.67 6.14zM9.65 18.6c-.02-.08-.1-.08-.1-.08l-7.38.26c.8 1.43 2.15 2.53 3.56 2.2.96-.25 3.16-1.78 3.88-2.3.06-.05.04-.09.04-.09zm.08-.78C6.49 15.63.21 12.28.21 12.28c-.15.46-.2.9-.21 1.3v.07c0 1.07.4 1.82.4 1.82.8 1.69 2.34 2.2 2.34 2.2.7.3 1.4.31 1.4.31.12.02 4.4 0 5.54 0 .05 0 .08-.05.08-.05v-.06c0-.03-.03-.05-.03-.05zM9.06 3.19a3.42 3.42 0 00-2.57 3.15v.41c.03.6.16 1.05.16 1.05.66 2.9 3.86 7.65 4.55 8.65.05.05.1.03.1.03a.1.1 0 00.06-.1c1.06-10.6-1.11-13.42-1.11-13.42-.32.02-1.19.23-1.19.23zm8.299 2.27s-.49-1.8-2.44-2.28c0 0-.57-.14-1.17-.22 0 0-2.18 2.81-1.12 13.43.01.07.06.08.06.08.07.03.1-.03.1-.03.72-1.03 3.9-5.76 4.55-8.64 0 0 .36-1.4.02-2.34zm-2.92 13.07s-.07 0-.09.05c0 0-.01.07.03.1.7.51 2.85 2 3.88 2.3 0 0 .16.05.43.06h.14c.69-.02 1.9-.37 3-2.26l-7.4-.25zm7.83-8.41c.14-2.06-1.94-3.97-1.94-3.98 0 0-3.85 4.66-6.67 10.8 0 0-.03.08.02.13l.04.01h.06c1.06-.53 5.46-2.77 7.28-4.54 0 0 1.15-.93 1.21-2.42zm1.52 2.14s-6.28 3.37-9.52 5.55c0 0-.05.04-.03.11 0 0 .03.06.07.06 1.16 0 5.56 0 5.67-.02 0 0 .57-.02 1.27-.29 0 0 1.56-.5 2.37-2.27 0 0 .73-1.45.17-3.14z";

function StoreGlyph({ id }: { id: PolarisStoreLink["id"] }) {
  if (id === "app-store") {
    // A plain phone outline: no store's logo is reproduced.
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="6.5" y="2.75" width="11" height="18.5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10.5 18h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={id === "huawei" ? HUAWEI_MARK : ANDROID_MARK} />
    </svg>
  );
}

/** The badges the config enables that the latest release can serve. */
export function polarisStoreLinks(available: PolarisAppAvailability | null): PolarisStoreLink[] {
  return polarisShownStores(POLARIS_LANDING_CONFIG.app.stores, available);
}

export function PolarisStoreBadges({
  available,
  className = "",
  showLabel = true,
}: {
  /** Which builds the latest release carries; null (unknown, or the check failed) hides every release-tied badge. */
  available: PolarisAppAvailability | null;
  className?: string;
  showLabel?: boolean;
}) {
  const stores = polarisStoreLinks(available);
  if (stores.length === 0) return null;
  const label = POLARIS_LANDING_CONFIG.app.label;
  return (
    <div className={`px-stores ${className}`}>
      {showLabel && <p className="px-stores-label">{label}</p>}
      <ul className="px-stores-list" aria-label={label}>
        {stores.map((store) => (
          <li key={store.id}>
            <a href={store.href} className="px-store" aria-label={`${store.eyebrow} ${store.label}`}>
              <StoreGlyph id={store.id} />
              <span>
                <small>{store.eyebrow}</small>
                <b>{store.label}</b>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PolarisStoreBadges;
