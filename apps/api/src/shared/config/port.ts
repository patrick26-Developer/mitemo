const DEFAULT_PORT = 3000;
const MAX_PORT = 65_535;
const DIGITS_ONLY = /^\d+$/;

/** Levée au démarrage quand la variable PORT ne désigne pas un port TCP utilisable. */
export class InvalidPortError extends Error {
  override readonly name = "InvalidPortError";

  /**
   * Construit l'erreur.
   * @param raw Valeur lue dans l'environnement.
   */
  constructor(raw: string) {
    super(`PORT invalide : ${JSON.stringify(raw)} (entier attendu entre 1 et ${MAX_PORT})`);
  }
}

/**
 * Lit le port HTTP de l'API depuis l'environnement.
 * @param raw Valeur brute de la variable PORT.
 * @returns Le port, ou 3000 si la variable est absente.
 * @throws {InvalidPortError} si la valeur n'est pas un entier entre 1 et 65535.
 */
export function readPort(raw: string | undefined): number {
  if (raw === undefined) return DEFAULT_PORT;
  const port = DIGITS_ONLY.test(raw) ? Number(raw) : Number.NaN;
  if (!(port >= 1 && port <= MAX_PORT)) throw new InvalidPortError(raw);
  return port;
}
