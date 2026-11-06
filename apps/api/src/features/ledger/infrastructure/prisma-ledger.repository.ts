import { createHash } from "node:crypto";

import { Prisma, type PrismaClient } from "../../../generated/prisma/client.js";
import {
  TransactionRaceError,
  withTransactionRetry,
} from "../../../shared/database/transaction-retry.js";
import type { JournalEntry } from "../domain/journal-entry.js";
import {
  InsufficientBalanceError,
  netChanges,
  NON_NEGATIVE_KINDS,
  UnknownAccountError,
  type LedgerAccount,
  type LedgerAccountKind,
} from "../domain/ledger-book.js";
import {
  ClosedAccountError,
  EntryAlreadyReversedError,
  IdempotencyConflictError,
  type LedgerRepository,
  type PostEntryCommand,
  type PostEntryResult,
} from "../domain/ledger.repository.js";

type Tx = Prisma.TransactionClient;

/** Essais bornés : chaque conflit est résolu par un essai complet, jamais partiel. */
const RETRY = { maxAttempts: 10, baseDelayMs: 25 } as const;

const SERIALIZABLE = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  maxWait: 10_000,
  timeout: 15_000,
} as const;

/**
 * Grand livre persisté dans PostgreSQL. Chaque écriture est enregistrée dans
 * une transaction `SERIALIZABLE`, rejouée en cas de conflit concurrent. Les
 * contrôles faits ici donnent des erreurs explicites ; la base garde les mêmes
 * garanties en dernier recours (migration `grand_livre`).
 */
export class PrismaLedgerRepository implements LedgerRepository {
  /**
   * Construit le dépôt.
   * @param prisma Client Prisma connecté par la connexion directe (non poolée).
   */
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Ouvre un compte.
   * @param account Identifiant et nature du compte.
   */
  async openAccount(account: LedgerAccount): Promise<void> {
    await this.prisma.ledgerAccount.create({ data: { id: account.id, kind: account.kind } });
  }

  /**
   * Clôture un compte.
   * @param accountId Identifiant du compte.
   * @throws {UnknownAccountError} si le compte n'existe pas.
   */
  async closeAccount(accountId: string): Promise<void> {
    const { count } = await this.prisma.ledgerAccount.updateMany({
      where: { id: accountId, closedAt: null },
      data: { closedAt: new Date() },
    });
    if (count === 0) await requireAccount(this.prisma, accountId);
  }

  /**
   * Enregistre une écriture, entièrement ou pas du tout.
   * @param command Écriture et contexte d'audit.
   * @returns `RECORDED`, ou `REPLAYED` pour une demande déjà traitée.
   */
  async post(command: PostEntryCommand): Promise<PostEntryResult> {
    const payloadHash = fingerprint(command);
    try {
      return await withTransactionRetry(
        () => this.prisma.$transaction((tx) => postOnce(tx, command, payloadHash), SERIALIZABLE),
        RETRY,
      );
    } catch (error) {
      throw translateDatabaseError(error);
    }
  }

  /**
   * Calcule le solde d'un compte à partir des imputations.
   * @param accountId Identifiant du compte.
   * @returns Le solde, en FCFA entiers.
   * @throws {UnknownAccountError} si le compte n'existe pas.
   */
  async balanceOf(accountId: string): Promise<bigint> {
    await requireAccount(this.prisma, accountId);
    return sumBalance(this.prisma, accountId);
  }
}

async function postOnce(
  tx: Tx,
  command: PostEntryCommand,
  payloadHash: string,
): Promise<PostEntryResult> {
  const replay = await findReplay(tx, command.idempotencyKey, payloadHash);
  if (replay !== undefined) return replay;
  await assertPostable(tx, command.entry);
  await insertEntry(tx, command, payloadHash);
  return { status: "RECORDED", entryId: command.entry.id };
}

async function findReplay(
  tx: Tx,
  idempotencyKey: string,
  payloadHash: string,
): Promise<PostEntryResult | undefined> {
  const existing = await tx.ledgerEntry.findUnique({ where: { idempotencyKey } });
  if (existing === null) return undefined;
  if (existing.payloadHash !== payloadHash) {
    throw new IdempotencyConflictError(
      `Clé d'idempotence déjà utilisée pour un autre contenu : ${idempotencyKey}`,
    );
  }
  return { status: "REPLAYED", entryId: existing.id };
}

async function assertPostable(tx: Tx, entry: JournalEntry): Promise<void> {
  const changes = netChanges(entry);
  const kinds = await requireOpenAccounts(tx, [...changes.keys()]);
  if (entry.reverses !== undefined) await assertNotReversed(tx, entry.reverses);
  for (const [accountId, change] of changes) {
    if (change >= 0n || !NON_NEGATIVE_KINDS.has(kinds.get(accountId) as LedgerAccountKind)) {
      continue;
    }
    if ((await sumBalance(tx, accountId)) + change < 0n) {
      throw new InsufficientBalanceError(`Solde insuffisant sur ${accountId}`);
    }
  }
}

async function requireOpenAccounts(tx: Tx, ids: readonly string[]): Promise<Map<string, string>> {
  const accounts = await tx.ledgerAccount.findMany({ where: { id: { in: [...ids] } } });
  const byId = new Map(accounts.map((account) => [account.id, account]));
  for (const id of ids) {
    const account = byId.get(id);
    if (account === undefined) throw new UnknownAccountError(`Compte inconnu : ${id}`);
    if (account.closedAt !== null) throw new ClosedAccountError(`Compte clôturé : ${id}`);
  }
  return new Map(accounts.map((account) => [account.id, account.kind]));
}

async function assertNotReversed(tx: Tx, originalId: string): Promise<void> {
  const reversal = await tx.ledgerEntry.findUnique({ where: { reversesEntryId: originalId } });
  if (reversal !== null) {
    throw new EntryAlreadyReversedError(`Écriture déjà annulée : ${originalId}`);
  }
}

function toEntryData(
  command: PostEntryCommand,
  payloadHash: string,
): Prisma.LedgerEntryCreateInput {
  const { entry } = command;
  return {
    id: entry.id,
    idempotencyKey: command.idempotencyKey,
    payloadHash,
    operationRef: command.operationRef,
    description: entry.description,
    occurredAt: new Date(entry.occurredAt),
    recordedBy: command.recordedBy,
    settlementMode: command.settlementMode,
    ...(entry.reverses === undefined ? {} : { reverses: { connect: { id: entry.reverses } } }),
    lines: { create: toLineData(entry) },
  };
}

function toLineData(entry: JournalEntry): Prisma.LedgerPostingLineCreateWithoutEntryInput[] {
  return entry.lines.map((line, index) => ({
    lineNo: index + 1,
    amount: line.amount,
    account: { connect: { id: line.accountId } },
  }));
}

async function insertEntry(tx: Tx, command: PostEntryCommand, payloadHash: string): Promise<void> {
  try {
    await tx.ledgerEntry.create({ data: toEntryData(command, payloadHash) });
  } catch (error) {
    // Une même clé insérée au même instant par une autre transaction : rejouer
    // l'essai complet relira l'écriture validée et renverra REPLAYED.
    if (mentions(error, "idempotency_key")) throw new TransactionRaceError("Clé concurrente");
    throw error;
  }
}

async function requireAccount(client: Tx | PrismaClient, accountId: string): Promise<void> {
  const account = await client.ledgerAccount.findUnique({ where: { id: accountId } });
  if (account === null) throw new UnknownAccountError(`Compte inconnu : ${accountId}`);
}

async function sumBalance(client: Tx | PrismaClient, accountId: string): Promise<bigint> {
  const { _sum } = await client.ledgerPostingLine.aggregate({
    where: { accountId },
    _sum: { amount: true },
  });
  return _sum.amount ?? 0n;
}

/**
 * Empreinte du contenu d'une demande, sans l'identifiant d'écriture : une
 * demande rejouée reçoit souvent un nouvel identifiant, pas un nouveau contenu.
 * @param command Demande d'enregistrement.
 * @returns Empreinte SHA-256 hexadécimale.
 */
function fingerprint(command: PostEntryCommand): string {
  const { entry } = command;
  const canonical = JSON.stringify({
    operationRef: command.operationRef,
    settlementMode: command.settlementMode,
    description: entry.description,
    occurredAt: entry.occurredAt,
    reverses: entry.reverses ?? null,
    lines: entry.lines.map((line) => [line.accountId, line.amount.toString()]),
  });
  return createHash("sha256").update(canonical).digest("hex");
}

/**
 * Traduit les refus de la base, ultime garde-fou, en erreurs du domaine.
 * @param error Erreur levée par la transaction.
 * @returns L'erreur du domaine correspondante, ou l'erreur d'origine.
 */
function translateDatabaseError(error: unknown): unknown {
  if (mentions(error, "LEDGER_NEGATIVE_BALANCE")) {
    return new InsufficientBalanceError("Solde insuffisant", { cause: error });
  }
  if (mentions(error, "LEDGER_ACCOUNT_CLOSED")) {
    return new ClosedAccountError("Compte clôturé", { cause: error });
  }
  if (mentions(error, "reverses_entry_id")) {
    return new EntryAlreadyReversedError("Écriture déjà annulée", { cause: error });
  }
  return error;
}

function mentions(error: unknown, needle: string): boolean {
  if (!(error instanceof Error)) return false;
  const meta = (error as { meta?: unknown }).meta;
  return `${error.message} ${JSON.stringify(meta ?? null)}`.includes(needle);
}
