import type {
  ApiErrorResponse,
  ApiFieldError,
  RegisterPushTokenRequest,
  RegisterPushTokenResponse,
} from "@mitemo/contracts";
import { IDEMPOTENCY_KEY_HEADER } from "@mitemo/contracts";

/** URL de base de l'API, fixée à la compilation par Expo. */
const API_BASE_URL = process.env["EXPO_PUBLIC_API_URL"] ?? "";

/** Corps d'erreur utilisé quand l'API ne répond pas au format du contrat. */
const FALLBACK_ERROR: ApiErrorResponse = {
  code: "INTERNAL",
  message: "L'API est injoignable pour le moment. Réessayez plus tard.",
  traceId: "inconnu",
};

/** Méthodes HTTP employées par les clients mobiles. */
export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

/** Paramètres d'un appel HTTP typé. */
export interface ApiRequestOptions {
  readonly method: HttpMethod;
  /** Chemin relatif à l'URL de base, par exemple « /notifications/push-tokens ». */
  readonly path: string;
  /** Corps JSON, absent pour une lecture. */
  readonly body?: unknown;
  /** Clé d'idempotence des requêtes qui écrivent. */
  readonly idempotencyKey?: string;
}

/** Erreur d'appel à l'API, porteuse du corps d'erreur du contrat. */
export class ApiClientError extends Error {
  override readonly name = "ApiClientError";
  /** Statut HTTP renvoyé, par exemple 409. */
  readonly status: number;
  /** Code stable du contrat, utilisable pour choisir un message. */
  readonly code: ApiErrorResponse["code"];
  /** Identifiant de trace à communiquer au support. */
  readonly traceId: string;
  /** Erreurs de validation par champ, vide hors validation. */
  readonly fields: readonly ApiFieldError[];

  /**
   * Construit l'erreur à partir du statut et du corps de la réponse.
   * @param status Statut HTTP.
   * @param body Corps d'erreur du contrat.
   */
  constructor(status: number, body: ApiErrorResponse) {
    super(body.message);
    this.status = status;
    this.code = body.code;
    this.traceId = body.traceId;
    this.fields = body.fields ?? [];
  }
}

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
 * Lit le corps d'erreur d'une réponse, sans jamais lever d'exception.
 * @param response Réponse en échec.
 * @returns Le corps du contrat, ou un corps de repli.
 */
async function readErrorBody(response: Response): Promise<ApiErrorResponse> {
  const body: unknown = await response.json().catch(() => null);

  return isApiErrorResponse(body) ? body : FALLBACK_ERROR;
}

/**
 * Construit les en-têtes d'un appel, avec la clé d'idempotence si fournie.
 * @param options Paramètres de l'appel.
 * @returns Les en-têtes prêts pour `fetch`.
 */
function buildHeaders(options: ApiRequestOptions): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.idempotencyKey !== undefined)
    headers[IDEMPOTENCY_KEY_HEADER] = options.idempotencyKey;

  return headers;
}

/**
 * Construit l'initialisation `fetch` d'un appel, sans corps vide.
 * @param options Paramètres de l'appel.
 * @returns L'initialisation de la requête.
 */
function buildInit(options: ApiRequestOptions): RequestInit {
  const init: RequestInit = { method: options.method, headers: buildHeaders(options) };
  if (options.body !== undefined) init.body = JSON.stringify(options.body);

  return init;
}

/**
 * Exécute un appel HTTP typé et convertit toute réponse en échec en
 * {@link ApiClientError}.
 * @param options Méthode, chemin, corps et clé d'idempotence.
 * @returns Le corps de la réponse, désérialisé.
 * @throws {ApiClientError} si l'API répond par une erreur.
 */
export async function apiRequest<ResponseBody>(options: ApiRequestOptions): Promise<ResponseBody> {
  const response = await fetch(`${API_BASE_URL}${options.path}`, buildInit(options));
  if (!response.ok) throw new ApiClientError(response.status, await readErrorBody(response));

  return (await response.json()) as ResponseBody;
}

/**
 * Construit une clé d'idempotence unique pour une écriture.
 * @returns La clé, courte et sans caractère réservé.
 */
function createIdempotencyKey(): string {
  return `mobile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Points d'entrée de l'API consommés par le mobile. */
export const apiClient = {
  /**
   * Enregistre le jeton de notification de l'appareil auprès de l'API.
   * @param payload Jeton, plateforme et version de l'application.
   * @returns L'horodatage d'enregistrement.
   * @throws {ApiClientError} si l'API refuse l'enregistrement.
   */
  registerPushToken(payload: RegisterPushTokenRequest): Promise<RegisterPushTokenResponse> {
    return apiRequest({
      method: "POST",
      path: "/notifications/push-tokens",
      body: payload,
      idempotencyKey: createIdempotencyKey(),
    });
  },
} as const;
