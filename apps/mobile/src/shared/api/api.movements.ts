import type { WalletMovementsResponse } from "@mitemo/contracts";
import type { ApiClient } from "./client.http";
import { MOVEMENTS_SCHEMA } from "./schema.movements";

/** Historique paginé du portefeuille, filtré par la session côté serveur. */
export interface MovementsApi {
  /** Lit la page suivante sans identifiant utilisateur fourni par le client. */
  list(cursor?: string): Promise<WalletMovementsResponse>;
}

/**
 * Crée la lecture authentifiée des mouvements, sans simulation locale.
 * @param client Client HTTP sécurisé existant.
 * @returns L'adaptateur d'historique.
 */
export function createMovementsApi(client: ApiClient): MovementsApi {
  return {
    list: (cursor) =>
      client.request({
        method: "GET",
        path:
          "/wallet/movements" +
          (cursor === undefined ? "" : "?cursor=" + encodeURIComponent(cursor)),
        auth: true,
        schema: MOVEMENTS_SCHEMA,
      }),
  };
}
