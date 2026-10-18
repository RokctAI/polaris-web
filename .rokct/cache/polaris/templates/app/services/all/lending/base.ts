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


// The lending SDK's own gateway base for its services. The services were
// written against the RokctAI_frontend host's app/services/common/base.ts,
// which a fresh shell (the Polaris web app, polaris/docs/web-app.md) does
// not have; this is the same surface over base_sdk's kernel platformCall
// (app/services/base/platform-gateway.ts), so it composes into any shell
// that composes base_sdk. Every call is a `{cmd, payload}` POST through the
// universal gateway with the signed-in session's credentials, and the answer
// comes back inside `{ message }` exactly as the host base returned it, so
// `response?.message` readers are unchanged. A failed call throws, as the
// host base did.

import "server-only";

import { platformCall } from "@/app/services/base/platform-gateway";

export interface ServiceOptions {
  headers?: Record<string, string>;
}

export class BaseService {
  public static async call(
    method: string,
    args: any = {},
    options: ServiceOptions = {},
  ): Promise<{ message: any }> {
    const message = await platformCall<any>(method, args, {
      headers: options.headers,
      throwOnError: true,
    });
    return { message };
  }

  public static async getList(
    doctype: string,
    args: any = {},
    options: ServiceOptions = {},
  ) {
    const response = await this.call(
      "frappe.client.get_list",
      { doctype, ...args },
      options,
    );
    return response?.message ?? [];
  }

  public static async getDoc(
    doctype: string,
    name: string,
    options: ServiceOptions = {},
  ) {
    const response = await this.call(
      "frappe.client.get",
      { doctype, name },
      options,
    );
    return response?.message;
  }

  /** Alias for getDoc, kept because several services call BaseService.get. */
  public static async get(
    doctype: string,
    name: string,
    options: ServiceOptions = {},
  ) {
    return this.getDoc(doctype, name, options);
  }

  public static async insert(doc: any, options: ServiceOptions = {}) {
    const response = await this.call("frappe.client.insert", { doc }, options);
    return response?.message;
  }

  public static async setValue(
    doctype: string,
    name: string,
    fieldname: any,
    options: ServiceOptions = {},
  ) {
    return this.call(
      "frappe.client.set_value",
      { doctype, name, fieldname },
      options,
    );
  }

  public static async delete(
    doctype: string,
    name: string,
    options: ServiceOptions = {},
  ) {
    return this.call("frappe.client.delete", { doctype, name }, options);
  }

  public static async submit(doc: any, options: ServiceOptions = {}) {
    return this.call("frappe.client.submit", { doc }, options);
  }

  public static async cancel(
    doctype: string,
    name: string,
    options: ServiceOptions = {},
  ) {
    return this.call("frappe.client.cancel", { doctype, name }, options);
  }
}
