import type { SessionResponse } from "@mitemo/contracts";

import type { SessionToken, SessionTokenVault } from "./model.session-token";
import { sessionTokenOf } from "./model.session-token";

/** Ce qu'il faut pour renouveler la session. */
export interface RefresherDeps {
  readonly vault: SessionTokenVault;
  /** Appelle `POST /auth/refresh` avec le jeton actuel. */
  readonly renew: (token: SessionToken) => Promise<SessionResponse>;
}

/** Renouvelle la session ; renvoie le nouveau jeton, ou `null` si c'est impossible. */
export type Refresher = (current: SessionToken) => Promise<SessionToken | null>;

/**
 * Renouvelle la session et conserve le nouveau jeton ; tout échec vaut refus.
 * @param deps Coffre et appel de renouvellement.
 * @param current Jeton refusé par l'API.
 * @returns Le nouveau jeton, ou `null`.
 */
async function renewOnce(deps: RefresherDeps, current: SessionToken): Promise<SessionToken | null> {
  try {
    const token = sessionTokenOf(await deps.renew(current));
    await deps.vault.save(token);
    return token;
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

/**
 * Crée un renouvellement partagé : des requêtes refusées en même temps
 * attendent un seul `POST /auth/refresh`, au lieu d'en lancer un chacune.
 * @param deps Coffre et appel de renouvellement.
 * @returns Le renouvellement partagé.
 */
export function createRefresher(deps: RefresherDeps): Refresher {
  let pending: Promise<SessionToken | null> | null = null;
  return (current) => {
    pending ??= renewOnce(deps, current).finally(() => {
      pending = null;
    });
    return pending;
  };
}
