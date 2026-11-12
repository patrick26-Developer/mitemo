import type { ApiErrorResponse } from "@mitemo/contracts";
import type { z } from "zod";

import { ApiClientError, ApiUnavailableError } from "./error.api";

/** Corps d'erreur utilisé quand l'API ne répond pas au format du contrat. */
const FALLBACK_ERROR: ApiErrorResponse = {
  code: "INTERNAL",
  message: "L'API est injoignable pour le moment. Réessayez plus tard.",
  traceId: "inconnu",
};

/**
 * Reconnaît un corps d'erreur conforme au contrat.
 * @param value Corps reçu, de type inconnu.
 * @returns `true` quand le corps porte un code, un message et une trace.
 */
function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ApiErrorResponse>;
  return (
    typeof candidate.code === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.traceId === "string"
  );
}

/**
 * Lit le corps JSON d'une réponse, sans jamais lever d'exception.
 * @param response Réponse reçue.
 * @returns Le corps, ou `undefined` s'il est vide ou illisible.
 */
async function readJson(response: Response): Promise<unknown> {
  return response.json().catch(() => undefined);
}

/**
 * Valide la réponse à la frontière : une erreur devient une
 * {@link ApiClientError}, un succès est vérifié contre le schéma attendu.
 * @param response Réponse reçue.
 * @param schema Schéma du corps attendu.
 * @returns Le corps validé.
 * @throws {ApiClientError} si l'API répond par une erreur.
 * @throws {ApiUnavailableError} si le corps ne respecte pas le contrat.
 */
export async function readResponse<Body>(
  response: Response,
  schema: z.ZodType<Body>,
): Promise<Body> {
  const body = response.status === 204 ? undefined : await readJson(response);
  if (!response.ok) {
    throw new ApiClientError(response.status, isApiErrorResponse(body) ? body : FALLBACK_ERROR);
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ApiUnavailableError("invalid-response");
  return parsed.data;
}
