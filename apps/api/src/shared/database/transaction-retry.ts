import { setTimeout as wait } from "node:timers/promises";

/**
 * Signale une course entre deux transactions détectée par l'adaptateur (par
 * exemple une clé d'idempotence insérée en même temps ailleurs). Rejouer
 * l'opération entière est sûr : elle relira l'état validé par l'autre.
 */
export class TransactionRaceError extends Error {
  override readonly name = "TransactionRaceError";
}

/** Levée quand une transaction échoue encore après le nombre maximal d'essais. */
export class TransactionRetryExhaustedError extends Error {
  override readonly name = "TransactionRetryExhaustedError";

  /**
   * Construit l'erreur.
   * @param attempts Nombre d'essais effectués.
   * @param cause Dernière erreur rencontrée.
   */
  constructor(attempts: number, cause: unknown) {
    super(`Transaction abandonnée après ${String(attempts)} essais`, { cause });
  }
}

/** Réglages de la reprise. */
export interface RetryOptions {
  /** Nombre total d'essais, 1 ou plus. */
  readonly maxAttempts: number;
  /** Délai du premier nouvel essai, doublé ensuite. 20 ms par défaut. */
  readonly baseDelayMs?: number;
  /** Attente injectable, pour des tests sans horloge réelle. */
  readonly sleep?: (ms: number) => Promise<void>;
  /** Tirage dans [0, 1) pour étaler les essais concurrents. */
  readonly random?: () => number;
}

const RETRYABLE_MESSAGES = [/could not serialize/i, /\b40001\b/, /\b40P01\b/, /deadlock detected/i];

/** Codes PostgreSQL d'un conflit de sérialisation et d'un interblocage. */
const RETRYABLE_SQLSTATES: ReadonlySet<unknown> = new Set(["40001", "40P01"]);

/**
 * Lit la cause structurée posée par l'adaptateur `@prisma/adapter-pg`
 * (`DriverAdapterError`), qui traduit 40001 et 40P01 en `TransactionWriteConflict`.
 * @param error Erreur levée par la transaction.
 * @returns `true` si la cause décrit un conflit entre transactions.
 */
function isDriverAdapterConflict(error: Error): boolean {
  const cause = error.cause as { kind?: unknown; originalCode?: unknown } | undefined;
  if (cause === undefined || cause === null) return false;
  return cause.kind === "TransactionWriteConflict" || RETRYABLE_SQLSTATES.has(cause.originalCode);
}

/**
 * Indique si une erreur vient d'un conflit entre transactions concurrentes et
 * peut donc être rejouée sans risque, l'opération entière ayant été annulée.
 * @param error Erreur levée par la transaction.
 * @returns `true` pour un conflit de sérialisation (P2034, 40001), un
 *   interblocage (40P01) ou une {@link TransactionRaceError}.
 */
export function isRetryableTransactionError(error: unknown): boolean {
  if (error instanceof TransactionRaceError) return true;
  if (!(error instanceof Error)) return false;
  if ((error as { code?: unknown }).code === "P2034") return true;
  if (isDriverAdapterConflict(error)) return true;
  return RETRYABLE_MESSAGES.some((pattern) => pattern.test(error.message));
}

/**
 * Exécute une transaction et la rejoue, un nombre borné de fois, après un
 * conflit entre transactions concurrentes. Toute autre erreur est propagée
 * immédiatement. Le travail rejoué doit être une transaction complète et
 * idempotente : chaque essai repart d'un état validé.
 * @param work Transaction complète à exécuter.
 * @param options Nombre d'essais et délais.
 * @returns Le résultat du premier essai réussi.
 * @throws {TransactionRetryExhaustedError} si tous les essais échouent sur un conflit.
 */
export async function withTransactionRetry<T>(
  work: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  if (options.maxAttempts < 1) throw new RangeError("maxAttempts doit valoir au moins 1");
  const delayBefore = backoff(options);
  const sleep = options.sleep ?? ((ms: number) => wait(ms).then(() => undefined));

  for (let attempt = 1; ; attempt += 1) {
    try {
      return await work();
    } catch (error) {
      if (!isRetryableTransactionError(error)) throw error;
      if (attempt >= options.maxAttempts) throw new TransactionRetryExhaustedError(attempt, error);
      await sleep(delayBefore(attempt));
    }
  }
}

/**
 * Délai avant le nouvel essai : doublé à chaque fois, étalé par un tirage.
 * @param options Délai de base et tirage.
 * @returns Le délai en millisecondes après l'essai numéro `attempt`.
 */
function backoff(options: RetryOptions): (attempt: number) => number {
  const random = options.random ?? Math.random;
  const baseDelayMs = options.baseDelayMs ?? 20;
  return (attempt) => Math.round(baseDelayMs * 2 ** (attempt - 1) * random());
}
