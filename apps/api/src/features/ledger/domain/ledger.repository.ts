import type { JournalEntry } from "./journal-entry.js";
import type { LedgerAccount } from "./ledger-book.js";

/**
 * Modes de règlement d'une écriture. Seul `SIMULATED` existe : aucun fonds réel
 * sans validation juridique (ADR 0005). Ajouter un mode réel exigera une
 * intégration serveur avec un partenaire agréé, une nouvelle valeur ici et une
 * migration qui lève la contrainte `ledger_entry_settlement_mode_check` ; ce
 * n'est jamais un paramètre transmis par un client.
 */
export const SETTLEMENT_MODES = ["SIMULATED"] as const;

/** Mode de règlement. Voir {@link SETTLEMENT_MODES}. */
export type SettlementMode = (typeof SETTLEMENT_MODES)[number];

/** Demande d'enregistrement d'une écriture, avec son contexte d'audit. */
export interface PostEntryCommand {
  readonly entry: JournalEntry;
  /** Clé d'idempotence : la même demande rejouée ne produit jamais deux écritures. */
  readonly idempotencyKey: string;
  /** Opération métier à l'origine de l'écriture, par exemple « funding:<id> ». */
  readonly operationRef: string;
  /**
   * Auteur de l'enregistrement : utilisateur, simulateur ou planificateur.
   * Fait partie de l'empreinte d'idempotence : une même clé présentée par un
   * autre auteur est un conflit, jamais un rejeu silencieux.
   */
  readonly recordedBy: string;
  readonly settlementMode: SettlementMode;
}

/**
 * Résultat d'un enregistrement. `REPLAYED` signale une demande déjà traitée
 * avec la même clé, le même contenu et le même auteur : rien n'a été écrit une
 * seconde fois, et `entryId` est celui de l'écriture d'origine.
 */
export interface PostEntryResult {
  readonly status: "RECORDED" | "REPLAYED";
  readonly entryId: string;
}

/** Levée quand une clé d'idempotence déjà utilisée arrive avec un autre contenu. */
export class IdempotencyConflictError extends Error {
  override readonly name = "IdempotencyConflictError";
}

/** Levée quand on tente d'annuler une écriture qui l'a déjà été. */
export class EntryAlreadyReversedError extends Error {
  override readonly name = "EntryAlreadyReversedError";
}

/** Levée quand une imputation vise un compte clôturé. */
export class ClosedAccountError extends Error {
  override readonly name = "ClosedAccountError";
}

/** Levée quand une contre-écriture n'inverse pas exactement les lignes de l'originale. */
export class ReversalMismatchError extends Error {
  override readonly name = "ReversalMismatchError";
}

/**
 * Port de persistance du grand livre. L'adaptateur garantit l'atomicité :
 * une écriture refusée ne laisse aucune trace, et deux demandes concurrentes
 * ne peuvent ni rendre un solde négatif, ni enregistrer deux fois la même clé.
 */
export interface LedgerRepository {
  /**
   * Ouvre un compte.
   * @param account Identifiant et nature du compte.
   */
  openAccount(account: LedgerAccount): Promise<void>;

  /**
   * Clôture un compte : plus aucune imputation ne l'accepte ensuite.
   * @param accountId Identifiant du compte.
   */
  closeAccount(accountId: string): Promise<void>;

  /**
   * Enregistre une écriture, entièrement ou pas du tout.
   * @param command Écriture et contexte d'audit.
   * @returns `RECORDED`, ou `REPLAYED` pour une demande déjà traitée.
   */
  post(command: PostEntryCommand): Promise<PostEntryResult>;

  /**
   * Calcule le solde d'un compte à partir des imputations.
   * @param accountId Identifiant du compte.
   * @returns Le solde, en FCFA entiers.
   */
  balanceOf(accountId: string): Promise<bigint>;
}
