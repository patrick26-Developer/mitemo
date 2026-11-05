/** Réponse de `GET /health`, utilisée par l'hébergeur et la supervision. */
export interface HealthResponse {
  readonly status: "ok";
}
