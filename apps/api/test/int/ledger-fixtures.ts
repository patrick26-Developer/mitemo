import { randomUUID } from "node:crypto";

import { toAmountMinor, toIsoDateTime } from "@mitemo/contracts";
import { afterAll, beforeAll } from "vitest";

import { PrismaService } from "../../src/shared/database/prisma.service.js";
import {
  createJournalEntry,
  type JournalEntry,
} from "../../src/features/ledger/domain/journal-entry.js";
import type { LedgerAccountKind } from "../../src/features/ledger/domain/ledger-book.js";
import type { PostEntryCommand } from "../../src/features/ledger/domain/ledger.repository.js";
import { PrismaLedgerRepository } from "../../src/features/ledger/infrastructure/prisma-ledger.repository.js";

// Chaque test crée ses propres comptes et écritures, aux identifiants uniques :
// la base interdit de supprimer une écriture, il n'y a donc rien à nettoyer.

/** Date métier commune aux écritures de test. */
export const AT = toIsoDateTime("2026-11-07T08:00:00.000Z");

/** Connexion et dépôt partagés par les tests d'un fichier. */
export interface LedgerFixture {
  prisma: PrismaService;
  repository: PrismaLedgerRepository;
}

/**
 * Connecte la base de test avant les tests du fichier et la déconnecte après.
 * @returns Un objet rempli au `beforeAll`, à n'utiliser que dans les tests.
 */
export function useLedgerDatabase(): LedgerFixture {
  const fixture = {} as LedgerFixture;
  beforeAll(async () => {
    fixture.prisma = new PrismaService();
    await fixture.prisma.$connect();
    fixture.repository = new PrismaLedgerRepository(fixture.prisma);
  });
  afterAll(async () => {
    await fixture.prisma.$disconnect();
  });
  return fixture;
}

/**
 * Identifiant unique, lisible dans la base.
 * @param prefix Préfixe décrivant l'objet.
 * @returns `<prefix>:<uuid>`.
 */
export function unique(prefix: string): string {
  return `${prefix}:${randomUUID()}`;
}

/**
 * Ouvre un compte au nom unique.
 * @param fixture Connexion de test.
 * @param kind Nature du compte.
 * @returns L'identifiant du compte.
 */
export async function openAccount(
  fixture: LedgerFixture,
  kind: LedgerAccountKind,
): Promise<string> {
  const id = unique(kind.toLowerCase());
  await fixture.repository.openAccount({ id, kind });
  return id;
}

/**
 * Écriture de virement entre deux comptes.
 * @param from Compte débité.
 * @param to Compte crédité.
 * @param amount Montant strictement positif, en FCFA entiers.
 * @returns L'écriture, avec un nouvel identifiant.
 */
export function transfer(from: string, to: string, amount: bigint): JournalEntry {
  return createJournalEntry({
    id: randomUUID(),
    occurredAt: AT,
    description: "Mouvement de test",
    lines: [
      { accountId: from, amount: toAmountMinor(-amount) },
      { accountId: to, amount: toAmountMinor(amount) },
    ],
  });
}

/**
 * Demande d'enregistrement simulée. La référence d'opération dépend de la clé,
 * comme une vraie opération métier rejouée.
 * @param entry Écriture à enregistrer.
 * @param idempotencyKey Clé d'idempotence ; nouvelle par défaut.
 * @returns La demande.
 */
export function command(
  entry: JournalEntry,
  idempotencyKey: string = randomUUID(),
): PostEntryCommand {
  return {
    entry,
    idempotencyKey,
    operationRef: `test:${idempotencyKey}`,
    recordedBy: "int-spec",
    settlementMode: "SIMULATED",
  };
}

/**
 * Portefeuille approvisionné depuis la contrepartie des opérations simulées.
 * @param fixture Connexion de test.
 * @param amount Montant de l'approvisionnement.
 * @returns Les identifiants du portefeuille et de la contrepartie.
 */
export async function fundedWallet(
  fixture: LedgerFixture,
  amount: bigint,
): Promise<{ wallet: string; clearing: string }> {
  const clearing = await openAccount(fixture, "CLEARING_SIMULATOR");
  const wallet = await openAccount(fixture, "WALLET_USER");
  await fixture.repository.post(command(transfer(clearing, wallet, amount)));
  return { wallet, clearing };
}

/** Imputations et annulation éventuelle d'une écriture insérée en SQL direct. */
export interface RawEntryData {
  readonly lines: readonly [string, bigint][];
  readonly reversesEntryId?: string | null;
}

/**
 * Insère une écriture et ses imputations en SQL direct, sans passer par le
 * dépôt : les tests de garanties prouvent ainsi que la base elle-même refuse.
 * @param fixture Connexion de test.
 * @param id Identifiant de l'écriture.
 * @param data Imputations et écriture annulée, le cas échéant.
 * @param data.lines Couples (compte, montant signé).
 * @param data.reversesEntryId Écriture annulée, le cas échéant.
 */
export async function insertRawEntry(
  fixture: LedgerFixture,
  id: string,
  { lines, reversesEntryId }: RawEntryData,
): Promise<void> {
  await fixture.prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      INSERT INTO ledger_entry (id, idempotency_key, payload_hash, operation_ref, description,
        occurred_at, recorded_by, settlement_mode, reverses_entry_id)
      VALUES (${id}, ${id}, 'brut', 'brut', 'Insertion SQL directe', now(), 'int-spec', 'SIMULATED',
        ${reversesEntryId ?? null})`;
    for (const [index, [accountId, amount]] of lines.entries()) {
      await tx.$executeRaw`
        INSERT INTO ledger_posting_line (entry_id, line_no, account_id, amount)
        VALUES (${id}, ${index + 1}, ${accountId}, ${amount})`;
    }
  });
}
