import { ApiUnavailableError } from "./error.api";

/** Fonction `fetch`, injectée pour les tests. */
export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

/** Requête à envoyer, avec son délai maximal. */
export interface TimedRequest {
  readonly fetch: FetchFn;
  readonly url: string;
  readonly init: RequestInit;
  /** Délai maximal d'attente de la réponse, en millisecondes. */
  readonly timeoutMs: number;
}

/**
 * Traduit un échec de `fetch` en erreur typée : délai dépassé ou réseau coupé.
 * @param error Erreur levée par `fetch`.
 * @param timedOut Vrai quand le délai a été dépassé.
 * @returns L'erreur à lever.
 */
function transportError(error: unknown, timedOut: boolean): unknown {
  if (timedOut) return new ApiUnavailableError("timeout");
  return error instanceof TypeError ? new ApiUnavailableError("offline") : error;
}

/**
 * Envoie une requête et l'abandonne si la réponse tarde : une connexion
 * mobile lente ne bloque jamais l'écran indéfiniment.
 * @param request URL, initialisation, délai et `fetch`.
 * @returns La réponse.
 * @throws {ApiUnavailableError} si le délai est dépassé ou le réseau coupé.
 */
export async function sendWithTimeout(request: TimedRequest): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, request.timeoutMs);
  try {
    return await request.fetch(request.url, { ...request.init, signal: controller.signal });
  } catch (error) {
    throw transportError(error, timedOut);
  } finally {
    clearTimeout(timer);
  }
}
