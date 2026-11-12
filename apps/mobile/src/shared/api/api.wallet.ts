import type {
  RegisterPushTokenRequest,
  RegisterPushTokenResponse,
  WalletSummaryResponse,
} from "@mitemo/contracts";

import type { ApiClient } from "./client.http";
import { PUSH_TOKEN_SCHEMA, WALLET_SUMMARY_SCHEMA } from "./schema.wallet";

/** Appels du compte : soldes du portefeuille et jeton de notification. */
export interface AccountApi {
  walletSummary(): Promise<WalletSummaryResponse>;
  /** Route pas encore exposée par l'API : l'appel échouera en 404 d'ici là. */
  registerPushToken(request: RegisterPushTokenRequest): Promise<RegisterPushTokenResponse>;
}

/**
 * Crée les appels du compte, tous protégés par la session.
 * @param client Client de l'API.
 * @returns Les appels du compte.
 */
export function createAccountApi(client: ApiClient): AccountApi {
  return {
    walletSummary: () =>
      client.request({ method: "GET", path: "/wallet", auth: true, schema: WALLET_SUMMARY_SCHEMA }),
    registerPushToken: (request) =>
      client.request({
        method: "POST",
        path: "/notifications/push-tokens",
        auth: true,
        body: request,
        idempotent: true,
        schema: PUSH_TOKEN_SCHEMA,
      }),
  };
}
