import type { SupportContactResponse } from "@mitemo/contracts";
import { z } from "zod";

import type { ApiClient } from "../../../shared/api/client.http";

/** Contact du service client reçu du backend, validé à la frontière. */
const SUPPORT_CONTACT_SCHEMA: z.ZodType<SupportContactResponse> = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/),
  maxAgeSeconds: z.number().int().positive(),
});

/** Appels du service client. */
export interface SupportApi {
  contact(): Promise<SupportContactResponse>;
}

/**
 * Crée les appels du service client, publics : ils servent aussi sans session.
 * @param client Client de l'API.
 * @returns Les appels du service client.
 */
export function createSupportApi(client: ApiClient): SupportApi {
  return {
    contact: () =>
      client.request({
        method: "GET",
        path: "/support/contact",
        auth: false,
        schema: SUPPORT_CONTACT_SCHEMA,
      }),
  };
}
