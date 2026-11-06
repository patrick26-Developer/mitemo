import type { AmountMinor, IsoDateTime } from "@mitemo/contracts";

/**
 * Imputation d'une écriture sur un compte du grand livre. Convention de signe :
 * un montant positif augmente le solde du compte, un montant négatif le diminue.
 * Montant en FCFA entiers (`AmountMinor`), jamais de flottant.
 */
export interface PostingLine {
  readonly accountId: string;
  readonly amount: AmountMinor;
}

/**
 * Écriture du grand livre : au moins deux imputations dont la somme est nulle
 * (partie double). Une écriture créée est figée : une correction passe par une
 * contre-écriture ({@link reverseEntry}), jamais par une modification.
 */
export interface JournalEntry {
  readonly id: string;
  readonly occurredAt: IsoDateTime;
  readonly description: string;
  readonly lines: readonly PostingLine[];
  /** Identifiant de l'écriture annulée, si celle-ci est une contre-écriture. */
  readonly reverses?: string;
}

/** Données nécessaires à la création d'une écriture. */
export interface JournalEntryInput {
  readonly id: string;
  readonly occurredAt: IsoDateTime;
  readonly description: string;
  readonly lines: readonly PostingLine[];
  readonly reverses?: string;
}

/** Données d'une contre-écriture : son identifiant, sa date et son motif. */
export interface ReversalInput {
  readonly id: string;
  readonly occurredAt: IsoDateTime;
  readonly description: string;
}

/** Levée quand la somme des imputations d'une écriture n'est pas nulle. */
export class UnbalancedEntryError extends Error {
  override readonly name = "UnbalancedEntryError";
  readonly imbalance: bigint;

  /**
   * Construit l'erreur.
   * @param imbalance Somme non nulle des imputations, conservée pour le diagnostic.
   */
  constructor(imbalance: bigint) {
    super(`Écriture déséquilibrée : la somme des imputations vaut ${imbalance.toString()}`);
    this.imbalance = imbalance;
  }
}

/** Levée quand une écriture est mal formée (identifiant, libellé ou imputations). */
export class InvalidEntryError extends Error {
  override readonly name = "InvalidEntryError";
}

/**
 * Crée une écriture équilibrée et figée.
 * @param input Identifiant, date, libellé et imputations de l'écriture.
 * @returns L'écriture, gelée en profondeur et indépendante de `input`.
 * @throws {InvalidEntryError} si l'identifiant ou le libellé est vide, s'il y a
 *   moins de deux imputations ou si une imputation est nulle.
 * @throws {UnbalancedEntryError} si la somme des imputations n'est pas nulle.
 */
export function createJournalEntry(input: JournalEntryInput): JournalEntry {
  assertWellFormed(input);
  const imbalance = input.lines.reduce((sum, line) => sum + line.amount, 0n);
  if (imbalance !== 0n) throw new UnbalancedEntryError(imbalance);

  const lines = Object.freeze(
    input.lines.map((line) => Object.freeze({ accountId: line.accountId, amount: line.amount })),
  );
  return Object.freeze({
    id: input.id,
    occurredAt: input.occurredAt,
    description: input.description,
    lines,
    ...(input.reverses === undefined ? {} : { reverses: input.reverses }),
  });
}

/**
 * Crée la contre-écriture qui annule exactement une écriture existante.
 * @param original Écriture à annuler.
 * @param meta Identifiant, date et motif de l'annulation.
 * @returns Une nouvelle écriture aux imputations opposées, liée à l'originale.
 * @throws {InvalidEntryError} si l'identifiant est celui de l'écriture annulée.
 */
export function reverseEntry(original: JournalEntry, meta: ReversalInput): JournalEntry {
  if (meta.id === original.id) {
    throw new InvalidEntryError("Une contre-écriture a son propre identifiant");
  }
  return createJournalEntry({
    ...meta,
    reverses: original.id,
    lines: original.lines.map((line) => ({
      accountId: line.accountId,
      amount: -line.amount as AmountMinor,
    })),
  });
}

function assertWellFormed(input: JournalEntryInput): void {
  if (input.id.trim().length === 0) throw new InvalidEntryError("Identifiant d'écriture vide");
  if (input.description.trim().length === 0) throw new InvalidEntryError("Libellé d'écriture vide");
  if (input.lines.length < 2) {
    throw new InvalidEntryError("Une écriture compte au moins deux imputations");
  }
  if (input.lines.some((line) => line.amount === 0n)) {
    throw new InvalidEntryError("Une imputation ne peut pas être nulle");
  }
}
