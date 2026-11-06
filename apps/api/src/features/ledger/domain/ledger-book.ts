import type { JournalEntry } from "./journal-entry.js";

/**
 * Plan de comptes du grand livre (issue #6). Les noms sont des valeurs
 * techniques stables, jamais affichées telles quelles à l'utilisateur.
 */
export const LEDGER_ACCOUNT_KINDS = [
  "WALLET_USER",
  "POT_TONTINE",
  "GUARANTEE_TONTINE",
  "GUARANTEE_MEMBER",
  "CLEARING_MTN",
  "CLEARING_AIRTEL",
  "PLATFORM_REVENUE",
  "PLATFORM_FEES_PSP",
  "SUSPENSE",
] as const;

/** Nature d'un compte du grand livre. Voir {@link LEDGER_ACCOUNT_KINDS}. */
export type LedgerAccountKind = (typeof LEDGER_ACCOUNT_KINDS)[number];

/**
 * Natures de comptes dont le solde ne peut jamais devenir négatif. L'issue #6
 * l'exige pour les portefeuilles ; les comptes de compensation, de revenus et
 * d'attente peuvent, eux, porter un solde négatif.
 */
const NON_NEGATIVE_KINDS: ReadonlySet<LedgerAccountKind> = new Set(["WALLET_USER"]);

/** Compte du grand livre. */
export interface LedgerAccount {
  readonly id: string;
  readonly kind: LedgerAccountKind;
}

/** Levée quand une écriture ou une lecture vise un compte qui n'a pas été ouvert. */
export class UnknownAccountError extends Error {
  override readonly name = "UnknownAccountError";
}

/** Levée quand on ouvre un compte dont l'identifiant existe déjà. */
export class DuplicateAccountError extends Error {
  override readonly name = "DuplicateAccountError";
}

/** Levée quand on enregistre une écriture dont l'identifiant existe déjà. */
export class DuplicateEntryError extends Error {
  override readonly name = "DuplicateEntryError";
}

/** Levée quand une écriture rendrait négatif un compte qui ne peut pas l'être. */
export class InsufficientBalanceError extends Error {
  override readonly name = "InsufficientBalanceError";
}

/**
 * Grand livre en mémoire, en ajout seul. Aucun solde n'est stocké : il est
 * toujours recalculé à partir des écritures. Une écriture refusée ne laisse
 * aucune trace. La persistance (PostgreSQL, transaction `SERIALIZABLE`,
 * interdiction de modifier en base) vient dans un adaptateur séparé.
 */
export class LedgerBook {
  private readonly accounts = new Map<string, LedgerAccount>();
  private readonly journal: JournalEntry[] = [];
  private readonly entryIds = new Set<string>();

  /**
   * Ouvre un compte.
   * @param account Identifiant et type du compte.
   * @throws {DuplicateAccountError} si l'identifiant existe déjà.
   */
  openAccount(account: LedgerAccount): void {
    if (this.accounts.has(account.id)) {
      throw new DuplicateAccountError(`Compte déjà ouvert : ${account.id}`);
    }
    this.accounts.set(account.id, Object.freeze({ ...account }));
  }

  /**
   * Enregistre une écriture, entièrement ou pas du tout.
   * @param entry Écriture équilibrée, créée par `createJournalEntry`.
   * @throws {DuplicateEntryError} si l'identifiant de l'écriture existe déjà.
   * @throws {UnknownAccountError} si une imputation vise un compte non ouvert.
   * @throws {InsufficientBalanceError} si un portefeuille deviendrait négatif.
   */
  post(entry: JournalEntry): void {
    if (this.entryIds.has(entry.id)) {
      throw new DuplicateEntryError(`Écriture déjà enregistrée : ${entry.id}`);
    }
    for (const [accountId, change] of netChanges(entry)) {
      const account = this.requireAccount(accountId);
      if (NON_NEGATIVE_KINDS.has(account.kind) && this.balanceOf(accountId) + change < 0n) {
        throw new InsufficientBalanceError(`Solde insuffisant sur ${accountId}`);
      }
    }
    this.journal.push(entry);
    this.entryIds.add(entry.id);
  }

  /**
   * Calcule le solde d'un compte.
   * @param accountId Identifiant du compte.
   * @returns La somme de ses imputations, en FCFA entiers.
   * @throws {UnknownAccountError} si le compte n'a pas été ouvert.
   */
  balanceOf(accountId: string): bigint {
    this.requireAccount(accountId);
    let balance = 0n;
    for (const entry of this.journal) {
      for (const line of entry.lines) if (line.accountId === accountId) balance += line.amount;
    }
    return balance;
  }

  /**
   * Historique des écritures, dans l'ordre d'enregistrement.
   * @returns Une copie figée : la modifier est impossible.
   */
  entries(): readonly JournalEntry[] {
    return Object.freeze([...this.journal]);
  }

  private requireAccount(accountId: string): LedgerAccount {
    const account = this.accounts.get(accountId);
    if (account === undefined) throw new UnknownAccountError(`Compte inconnu : ${accountId}`);
    return account;
  }
}

/**
 * Calcule la variation nette de chaque compte touché par une écriture.
 * @param entry Écriture à analyser.
 * @returns Pour chaque compte, la somme de ses imputations dans l'écriture.
 */
function netChanges(entry: JournalEntry): Map<string, bigint> {
  const changes = new Map<string, bigint>();
  for (const line of entry.lines) {
    changes.set(line.accountId, (changes.get(line.accountId) ?? 0n) + line.amount);
  }
  return changes;
}
