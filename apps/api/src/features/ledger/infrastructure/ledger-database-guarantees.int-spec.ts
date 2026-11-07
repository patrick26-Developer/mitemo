import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  fundedWallet as funded,
  insertRawEntry,
  openAccount,
  unique,
  useLedgerDatabase,
} from "../../../../test/int/ledger-fixtures.js";
import { LEDGER_ACCOUNT_KINDS, type LedgerAccountKind } from "../domain/ledger-book.js";

// Ces tests contournent volontairement le code applicatif et écrivent en SQL :
// ils prouvent que les garanties du grand livre tiennent dans la base elle-même.

const fx = useLedgerDatabase();
const open = (kind: LedgerAccountKind): Promise<string> => openAccount(fx, kind);
const fundedWallet = (amount: bigint): Promise<{ wallet: string; clearing: string }> =>
  funded(fx, amount);

function rawEntry(id: string, lines: readonly [string, bigint][]): Promise<void> {
  return insertRawEntry(fx, id, { lines });
}

describe("garanties en base, hors du code applicatif", () => {
  it("accepte une écriture équilibrée insérée ligne par ligne (vérification différée)", async () => {
    const a = await open("SUSPENSE");
    const b = await open("SUSPENSE");
    const c = await open("SUSPENSE");

    await rawEntry(randomUUID(), [
      [a, -300n],
      [b, 100n],
      [c, 200n],
    ]);

    expect(await fx.repository.balanceOf(c)).toBe(200n);
  });

  it("refuse une écriture déséquilibrée, sans rien laisser", async () => {
    const a = await open("SUSPENSE");
    const b = await open("SUSPENSE");
    const id = randomUUID();

    await expect(
      rawEntry(id, [
        [a, -300n],
        [b, 299n],
      ]),
    ).rejects.toThrow(/LEDGER_UNBALANCED/);
    expect(await fx.prisma.ledgerEntry.count({ where: { id } })).toBe(0);
  });

  it("refuse une écriture d'une seule imputation ou sans imputation", async () => {
    const a = await open("SUSPENSE");

    await expect(rawEntry(randomUUID(), [[a, 10n]])).rejects.toThrow(/LEDGER_UNBALANCED/);
    await expect(rawEntry(randomUUID(), [])).rejects.toThrow(/LEDGER_UNBALANCED/);
  });

  it("refuse d'ajouter une imputation à une écriture déjà enregistrée", async () => {
    const { wallet, clearing } = await fundedWallet(500n);
    const stored = await fx.prisma.ledgerPostingLine.findFirstOrThrow({
      where: { accountId: wallet },
    });

    await expect(
      fx.prisma.$executeRaw`INSERT INTO ledger_posting_line (entry_id, line_no, account_id, amount)
        VALUES (${stored.entryId}, 3, ${clearing}, 1)`,
    ).rejects.toThrow(/LEDGER_UNBALANCED/);
  });

  it("refuse de modifier une écriture ou une imputation enregistrée", async () => {
    const { wallet } = await fundedWallet(500n);
    const stored = await fx.prisma.ledgerPostingLine.findFirstOrThrow({
      where: { accountId: wallet },
    });

    await expect(
      fx.prisma.$executeRaw`UPDATE ledger_posting_line SET amount = 1000000
        WHERE entry_id = ${stored.entryId}`,
    ).rejects.toThrow(/LEDGER_IMMUTABLE/);
    await expect(
      fx.prisma
        .$executeRaw`UPDATE ledger_entry SET description = 'modifiée' WHERE id = ${stored.entryId}`,
    ).rejects.toThrow(/LEDGER_IMMUTABLE/);
    expect(await fx.repository.balanceOf(wallet)).toBe(500n);
  });

  it("refuse de supprimer ou de vider les écritures et les comptes", async () => {
    const { wallet } = await fundedWallet(500n);
    const stored = await fx.prisma.ledgerPostingLine.findFirstOrThrow({
      where: { accountId: wallet },
    });

    await expect(
      fx.prisma.$executeRaw`DELETE FROM ledger_posting_line WHERE entry_id = ${stored.entryId}`,
    ).rejects.toThrow(/LEDGER_IMMUTABLE/);
    await expect(
      fx.prisma.$executeRaw`DELETE FROM ledger_entry WHERE id = ${stored.entryId}`,
    ).rejects.toThrow(/LEDGER_IMMUTABLE/);
    await expect(
      fx.prisma.$executeRaw`DELETE FROM ledger_account WHERE id = ${wallet}`,
    ).rejects.toThrow(/LEDGER_IMMUTABLE/);
    await expect(fx.prisma.$executeRawUnsafe("TRUNCATE ledger_posting_line")).rejects.toThrow(
      /LEDGER_IMMUTABLE/,
    );
    await expect(fx.prisma.$executeRawUnsafe("TRUNCATE ledger_entry CASCADE")).rejects.toThrow(
      /LEDGER_IMMUTABLE/,
    );
  });

  it("refuse tout mode de règlement autre que SIMULATED (ADR 0005)", async () => {
    const id = randomUUID();

    await expect(
      fx.prisma
        .$executeRaw`INSERT INTO ledger_entry (id, idempotency_key, payload_hash, operation_ref,
        description, occurred_at, recorded_by, settlement_mode)
        VALUES (${id}, ${id}, 'brut', 'brut', 'Fonds réels', now(), 'int-spec', 'PARTNER')`,
    ).rejects.toThrow(/ledger_entry_settlement_mode_check/);
  });

  it("accepte exactement les natures de comptes du domaine", async () => {
    for (const kind of LEDGER_ACCOUNT_KINDS) await open(kind);

    await expect(
      fx.prisma.$executeRaw`INSERT INTO ledger_account (id, kind) VALUES (${unique("x")}, 'BANK')`,
    ).rejects.toThrow(/ledger_account_kind_check/);
  });

  it("interdit de changer la nature d'un compte ou de le rouvrir", async () => {
    const id = await open("WALLET_USER");

    await expect(
      fx.prisma.$executeRaw`UPDATE ledger_account SET kind = 'SUSPENSE' WHERE id = ${id}`,
    ).rejects.toThrow(/LEDGER_IMMUTABLE/);
    await fx.repository.closeAccount(id);
    await expect(
      fx.prisma.$executeRaw`UPDATE ledger_account SET closed_at = NULL WHERE id = ${id}`,
    ).rejects.toThrow(/LEDGER_IMMUTABLE/);
  });
});
