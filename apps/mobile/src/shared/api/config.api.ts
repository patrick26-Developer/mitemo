import { useSessionStore } from "../session/store.session";
import type { AccountApi } from "./api.wallet";
import { createAccountApi } from "./api.wallet";
import type { IdentityApi } from "./api.identity";
import { createIdentityApi } from "./api.identity";
import type { ApiClient } from "./client.http";
import { createApiClient } from "./client.http";
import { parseApiBaseUrl } from "./model.api-base-url";
import { secureSessionTokenVault } from "./vault.session-token";
import { withPreviewAdmission } from "./fetch.preview-admission";
import { createMovementsApi } from "./api.movements";
import { createSavingsApi } from "./api.savings";

/** Délai maximal d'une requête, en millisecondes : 15 s sur un réseau mobile lent. */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * URL de base de l'API, validée à la compilation : HTTPS obligatoire, HTTP
 * toléré seulement en développement vers la machine ou le réseau local.
 */
export const API_BASE_URL = parseApiBaseUrl(process.env.EXPO_PUBLIC_API_URL, {
  allowLocalHttp: __DEV__,
});

/**
 * Client de l'application : jeton dans le trousseau, et retour à la
 * connexion dès que l'API refuse définitivement la session.
 */
export const apiClient: ApiClient = createApiClient({
  baseUrl: API_BASE_URL,
  fetch: withPreviewAdmission((url, init) => fetch(url, init), API_BASE_URL),
  vault: secureSessionTokenVault,
  now: () => Date.now(),
  timeoutMs: REQUEST_TIMEOUT_MS,
  onSessionExpired: () => useSessionStore.getState().signOut(),
});

/** Appels d'identité de l'application. */
export const identityApi: IdentityApi = createIdentityApi(apiClient, secureSessionTokenVault);

/** Appels du compte de l'application. */
export const accountApi: AccountApi = createAccountApi(apiClient);

/** Historique du portefeuille, exclusivement issu du serveur. */
export const movementsApi = createMovementsApi(apiClient);

/** Objectifs d'épargne individuels conservés côté serveur. */
export const savingsApi = createSavingsApi(apiClient);
