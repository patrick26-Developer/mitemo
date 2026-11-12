import { IDEMPOTENCY_KEY_HEADER } from "@mitemo/contracts";
import { randomUUID } from "expo-crypto";
import type { z } from "zod";

import { ApiClientError, ApiUnavailableError, UNAUTHENTICATED_BODY } from "./error.api";
import type { ApiBaseUrl } from "./model.api-base-url";
import type { SessionToken, SessionTokenVault } from "./model.session-token";
import { isTokenUsable } from "./model.session-token";
import { readResponse } from "./response.http";
import { SESSION_SCHEMA } from "./schema.session";
import type { Refresher } from "./session.refresh";
import { createRefresher } from "./session.refresh";
import type { FetchFn } from "./transport.http";
import { sendWithTimeout } from "./transport.http";

/** Méthodes HTTP employées par le mobile. */
export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

/** Appel typé à l'API. */
export interface ApiCall<Body> {
  readonly method: HttpMethod;
  /** Chemin relatif à l'URL de base, par exemple « /me ». */
  readonly path: string;
  /** Vrai pour une route protégée : le jeton du trousseau est envoyé. */
  readonly auth: boolean;
  /** Corps JSON, absent pour une lecture. */
  readonly body?: unknown;
  /** Vrai pour une écriture rejouable sans effet double : une clé d'idempotence est jointe. */
  readonly idempotent?: boolean;
  /** Schéma du corps attendu, vérifié avant tout usage. */
  readonly schema: z.ZodType<Body>;
}

/** Dépendances du client, injectées pour les tests. */
export interface ApiClientDeps {
  readonly baseUrl: ApiBaseUrl;
  readonly fetch: FetchFn;
  readonly vault: SessionTokenVault;
  /** Horloge, en millisecondes depuis l'époque Unix. */
  readonly now: () => number;
  /** Délai maximal d'une requête, en millisecondes. */
  readonly timeoutMs: number;
  /** Prévient l'application qu'il faut se reconnecter. */
  readonly onSessionExpired: () => void;
}

/** Client de l'API. */
export interface ApiClient {
  /**
   * Exécute un appel et valide sa réponse.
   * @throws {ApiClientError} si l'API répond par une erreur.
   * @throws {ApiUnavailableError} si l'API est injoignable ou hors contrat.
   */
  request<Body>(call: ApiCall<Body>): Promise<Body>;
}

/** Contexte partagé par les appels d'un client. */
interface ClientContext {
  readonly deps: ApiClientDeps;
  readonly baseUrl: string;
  readonly refresh: Refresher;
}

/**
 * Construit les en-têtes : JSON, jeton éventuel, clé d'idempotence éventuelle.
 * @param call Appel à envoyer.
 * @param token Jeton à joindre, ou `null`.
 * @returns Les en-têtes.
 */
function headersFor(call: ApiCall<unknown>, token: SessionToken | null): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (call.body !== undefined) headers["Content-Type"] = "application/json";
  if (token !== null) headers["Authorization"] = `Bearer ${token.accessToken}`;
  if (call.idempotent === true) headers[IDEMPOTENCY_KEY_HEADER] = `mobile-${randomUUID()}`;
  return headers;
}

/**
 * Envoie un appel, avec ou sans jeton.
 * @param context Contexte du client.
 * @param call Appel à envoyer.
 * @param token Jeton à joindre, ou `null`.
 * @returns La réponse brute.
 */
function send(
  context: ClientContext,
  call: ApiCall<unknown>,
  token: SessionToken | null,
): Promise<Response> {
  const init: RequestInit = {
    method: call.method,
    headers: headersFor(call, token),
    cache: "no-store",
  };
  if (call.body !== undefined) init.body = JSON.stringify(call.body);
  const { fetch, timeoutMs } = context.deps;
  return sendWithTimeout({ fetch, url: `${context.baseUrl}${call.path}`, init, timeoutMs });
}

/**
 * Efface la session locale et prévient l'application.
 * @param context Contexte du client.
 * @returns L'erreur « session expirée » à lever.
 */
async function expire(context: ClientContext): Promise<ApiClientError> {
  await context.deps.vault.clear();
  context.deps.onSessionExpired();
  return new ApiClientError(401, UNAUTHENTICATED_BODY);
}

/**
 * Exécute un appel protégé : jamais de jeton expiré sur le réseau, un seul
 * renouvellement sur un 401, puis déconnexion si l'API refuse encore.
 * @param context Contexte du client.
 * @param call Appel à envoyer.
 * @returns La réponse brute, acceptée par l'API.
 * @throws {ApiClientError} si la session ne peut pas être rétablie.
 */
async function sendAuthenticated(
  context: ClientContext,
  call: ApiCall<unknown>,
): Promise<Response> {
  const token = await context.deps.vault.load();
  if (token === null || !isTokenUsable(token, context.deps.now())) throw await expire(context);
  const response = await send(context, call, token);
  if (response.status !== 401) return response;
  const renewed = await context.refresh(token);
  if (renewed === null) throw await expire(context);
  const retried = await send(context, call, renewed);
  if (retried.status === 401) throw await expire(context);
  return retried;
}

/**
 * Crée le renouvellement de session du client, appelé sans renouvellement
 * imbriqué pour ne jamais boucler.
 * @param context Contexte du client, sans son renouvellement.
 * @returns Le renouvellement partagé.
 */
function refresherFor(context: Omit<ClientContext, "refresh">): Refresher {
  return createRefresher({
    vault: context.deps.vault,
    renew: async (token) => {
      const call = {
        method: "POST",
        path: "/auth/refresh",
        auth: true,
        schema: SESSION_SCHEMA,
      } as const;
      const response = await send(
        { ...context, refresh: () => Promise.resolve(null) },
        call,
        token,
      );
      return readResponse(response, SESSION_SCHEMA);
    },
  });
}

/**
 * Crée le client de l'API : HTTPS imposé par l'URL validée, délai maximal,
 * jeton lu dans le trousseau, session renouvelée une fois sur un 401, et
 * réponses validées contre le contrat. Rien n'est journalisé.
 * @param deps URL validée, `fetch`, coffre, horloge, délai et fin de session.
 * @returns Le client.
 */
export function createApiClient(deps: ApiClientDeps): ApiClient {
  const { baseUrl } = deps;
  if (!baseUrl.ok) {
    return { request: () => Promise.reject(new ApiUnavailableError("not-configured")) };
  }
  const partial = { deps, baseUrl: baseUrl.url };
  const context: ClientContext = { ...partial, refresh: refresherFor(partial) };
  return {
    async request(call) {
      const response = call.auth
        ? await sendAuthenticated(context, call)
        : await send(context, call, null);
      return readResponse(response, call.schema);
    },
  };
}
