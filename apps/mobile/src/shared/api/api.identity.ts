import type {
  ActiveSession,
  CurrentUser,
  RegisterDemoUserRequest,
  SessionResponse,
  StartLoginRequest,
  StartLoginResponse,
  UpdateCurrentUserRequest,
  VerifyLoginRequest,
} from "@mitemo/contracts";

import type { z } from "zod";

import type { ApiCall, ApiClient } from "./client.http";
import type { SessionTokenVault } from "./model.session-token";
import { sessionTokenOf } from "./model.session-token";
import { SESSION_SCHEMA } from "./schema.session";
import {
  ACTIVE_SESSIONS_SCHEMA,
  NO_CONTENT_SCHEMA,
  START_LOGIN_SCHEMA,
  USER_SCHEMA,
} from "./schema.identity";

/** Appels d'identité : inscription, connexion en deux étapes, profil et sessions. */
export interface IdentityApi {
  register(request: RegisterDemoUserRequest): Promise<CurrentUser>;
  startLogin(request: StartLoginRequest): Promise<StartLoginResponse>;
  /** Vérifie l'OTP, puis conserve le jeton dans le trousseau. */
  verifyLogin(request: VerifyLoginRequest): Promise<SessionResponse>;
  me(): Promise<CurrentUser>;
  updateMe(request: UpdateCurrentUserRequest): Promise<CurrentUser>;
  sessions(): Promise<readonly ActiveSession[]>;
  revokeSession(sessionId: string): Promise<void>;
  /** Ferme la session côté API, et efface toujours le jeton local. */
  logout(): Promise<void>;
}

/**
 * Vérifie l'OTP et conserve le jeton, seulement une fois la réponse validée.
 * @param client Client de l'API.
 * @param vault Coffre du jeton.
 * @param request Défi et OTP.
 * @returns La session ouverte.
 */
async function verifyAndKeep(
  client: ApiClient,
  vault: SessionTokenVault,
  request: VerifyLoginRequest,
): Promise<SessionResponse> {
  const session = await client.request({
    method: "POST",
    path: "/auth/verify",
    auth: false,
    body: request,
    schema: SESSION_SCHEMA,
  });
  await vault.save(sessionTokenOf(session));
  return session;
}

/**
 * Ferme la session côté API ; le jeton local est effacé même si l'API est
 * injoignable, pour ne jamais garder une session qu'on a voulu fermer.
 * @param client Client de l'API.
 * @param vault Coffre du jeton.
 */
async function logout(client: ApiClient, vault: SessionTokenVault): Promise<void> {
  try {
    await client.request({
      method: "DELETE",
      path: "/auth/session",
      auth: true,
      schema: NO_CONTENT_SCHEMA,
    });
  } finally {
    await vault.clear();
  }
}

/**
 * Appels publics : inscription et connexion en deux étapes.
 * @param client Client de l'API.
 * @param vault Coffre du jeton de session.
 * @returns Les appels publics.
 */
function publicCalls(
  client: ApiClient,
  vault: SessionTokenVault,
): Pick<IdentityApi, "register" | "startLogin" | "verifyLogin"> {
  const post = <Body>(path: string, body: unknown, schema: z.ZodType<Body>) =>
    client.request({ method: "POST", path, auth: false, body, schema });
  return {
    register: (request) => post("/auth/register", request, USER_SCHEMA),
    startLogin: (request) => post("/auth/login", request, START_LOGIN_SCHEMA),
    verifyLogin: (request) => verifyAndKeep(client, vault, request),
  };
}

/**
 * Révoque une session active du compte, par exemple un téléphone perdu.
 * @param client Client de l'API.
 * @param sessionId Session à révoquer ; encodée dans le chemin.
 */
async function revokeSession(client: ApiClient, sessionId: string): Promise<void> {
  await client.request({
    method: "DELETE",
    path: `/auth/sessions/${encodeURIComponent(sessionId)}`,
    auth: true,
    schema: NO_CONTENT_SCHEMA,
  });
}

/**
 * Appels protégés par la session : profil, sessions actives et déconnexion.
 * @param client Client de l'API.
 * @param vault Coffre du jeton de session.
 * @returns Les appels protégés.
 */
function sessionCalls(
  client: ApiClient,
  vault: SessionTokenVault,
): Omit<IdentityApi, "register" | "startLogin" | "verifyLogin"> {
  const call = <Body>(request: Omit<ApiCall<Body>, "auth">) =>
    client.request({ ...request, auth: true });
  return {
    me: () => call({ method: "GET", path: "/me", schema: USER_SCHEMA }),
    updateMe: (request) =>
      call({ method: "PATCH", path: "/me", schema: USER_SCHEMA, body: request }),
    sessions: () => call({ method: "GET", path: "/auth/sessions", schema: ACTIVE_SESSIONS_SCHEMA }),
    revokeSession: (sessionId) => revokeSession(client, sessionId),
    logout: () => logout(client, vault),
  };
}

/**
 * Crée les appels d'identité. Le PIN et l'OTP ne transitent que dans le corps
 * des requêtes HTTPS, ne sont jamais conservés ni journalisés.
 * @param client Client de l'API.
 * @param vault Coffre du jeton de session.
 * @returns Les appels d'identité.
 */
export function createIdentityApi(client: ApiClient, vault: SessionTokenVault): IdentityApi {
  return { ...publicCalls(client, vault), ...sessionCalls(client, vault) };
}
