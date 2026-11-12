import type { ApiErrorResponse, ApiFieldError } from "@mitemo/contracts";

/** Erreur renvoyée par l'API, porteuse du corps d'erreur du contrat. */
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

/** Raisons pour lesquelles l'API n'a pas pu répondre correctement. */
export const API_UNAVAILABLE_REASONS = [
  "not-configured",
  "timeout",
  "offline",
  "invalid-response",
] as const;

/** Raison d'une API injoignable. Voir {@link API_UNAVAILABLE_REASONS}. */
export type ApiUnavailableReason = (typeof API_UNAVAILABLE_REASONS)[number];

/**
 * L'API n'a pas répondu, ou pas au format du contrat : URL non configurée ou
 * non sécurisée, délai dépassé, réseau coupé, réponse inattendue.
 */
export class ApiUnavailableError extends Error {
  override readonly name = "ApiUnavailableError";
  readonly reason: ApiUnavailableReason;

  /**
   * Construit l'erreur.
   * @param reason Raison de l'échec.
   */
  constructor(reason: ApiUnavailableReason) {
    super("L'API est injoignable pour le moment. Réessayez plus tard.");
    this.reason = reason;
  }
}

/** Corps d'erreur local d'une session absente ou refusée. */
export const UNAUTHENTICATED_BODY: ApiErrorResponse = {
  code: "UNAUTHENTICATED",
  message: "Votre session a expiré. Reconnectez-vous.",
  traceId: "local",
};
