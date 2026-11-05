/**
 * Codes d'erreur renvoyés par l'API. Ajouter un code est une évolution du contrat :
 * les clients web et mobile doivent le traiter dans la même pull request.
 */
export const API_ERROR_CODES = [
  "VALIDATION_FAILED",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "INTERNAL",
] as const;

/** Code d'erreur stable, utilisable par les clients pour choisir un message. */
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

/** Erreur de validation sur un champ précis de la requête. */
export interface ApiFieldError {
  /** Chemin du champ, par exemple « members.0.phone ». */
  readonly field: string;
  /** Raison lisible par un développeur, jamais affichée telle quelle à l'utilisateur. */
  readonly reason: string;
}

/** Corps de toute réponse d'erreur de l'API. */
export interface ApiErrorResponse {
  readonly code: ApiErrorCode;
  readonly message: string;
  /** Identifiant de trace, à communiquer au support. */
  readonly traceId: string;
  readonly fields?: readonly ApiFieldError[];
}
