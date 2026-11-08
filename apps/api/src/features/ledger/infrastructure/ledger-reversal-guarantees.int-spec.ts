import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  insertRawEntry,
  openAccount,
  useLedgerDatabase,
} from "../../../../test/int/ledger-fixtures.js";

// Ces tests écrivent en SQL direct : ils prouvent que la base refuse une
// contre-écriture qui n'annule pas exactement les lignes de l'originale.

const fx = useLedgerDatabase();
const openSuspense = (): Promise<string> => openAccount(fx, "SUSPENSE");

function rawEntry(
  id: string,
  lines: readonly [string, bigint][],
  reversesEntryId: string | null = null,
): Promise<void> {
  return insertRawEntry(fx, id, { lines, reversesEntryId });
}

describe("contre-écritures garanties par la base", () => {
  it("accepte une contre-écriture exacte, même si les lignes sont dans un autre ordre", async () => {
    const a = await openSuspense();
    const b = await openSuspense();
    const originalId = randomUUID();
    await rawEntry(originalId, [
      [a, -300n],
      [b, 300n],
    ]);

    await rawEntry(
      randomUUID(),
      [
        [b, -300n],
        [a, 300n],
      ],
      originalId,
    );

    expect(await fx.repository.balanceOf(a)).toBe(0n);
    expect(await fx.repository.balanceOf(b)).toBe(0n);
  });

  it("refuse une contre-écriture qui n'inverse pas exactement l'originale", async () => {
    const a = await openSuspense();
    const b = await openSuspense();
    const c = await openSuspense();
    const originalId = randomUUID();
    await rawEntry(originalId, [
      [a, -300n],
      [b, 300n],
    ]);
    const reversalId = randomUUID();

    await expect(
      rawEntry(
        reversalId,
        [
          [a, 300n],
          [c, -300n],
        ],
        originalId,
      ),
    ).rejects.toThrow(/LEDGER_REVERSAL_MISMATCH/);
    expect(await fx.prisma.ledgerEntry.count({ where: { id: reversalId } })).toBe(0);
  });

  it("refuse une contre-écriture dont une ligne a un montant différent", async () => {
    const a = await openSuspense();
    const b = await openSuspense();
    const originalId = randomUUID();
    await rawEntry(originalId, [
      [a, -300n],
      [b, 300n],
    ]);

    await expect(
      rawEntry(
        randomUUID(),
        [
          [a, 299n],
          [b, -299n],
        ],
        originalId,
      ),
    ).rejects.toThrow(/LEDGER_REVERSAL_MISMATCH/);
  });

  it("refuse une contre-écriture à laquelle il manque une ligne", async () => {
    const a = await openSuspense();
    const b = await openSuspense();
    const originalId = randomUUID();
    await rawEntry(originalId, [
      [a, -100n],
      [a, 100n],
      [b, -100n],
      [b, 100n],
    ]);

    // Équilibrée, mais elle n'annule que deux des quatre lignes de l'originale.
    await expect(
      rawEntry(
        randomUUID(),
        [
          [a, -100n],
          [a, 100n],
        ],
        originalId,
      ),
    ).rejects.toThrow(/LEDGER_REVERSAL_MISMATCH/);
  });

  it("refuse d'ajouter des lignes équilibrées à une contre-écriture enregistrée", async () => {
    const a = await openSuspense();
    const b = await openSuspense();
    const c = await openSuspense();
    const originalId = randomUUID();
    await rawEntry(originalId, [
      [a, -100n],
      [b, 100n],
    ]);
    const reversalId = randomUUID();
    await rawEntry(
      reversalId,
      [
        [b, -100n],
        [a, 100n],
      ],
      originalId,
    );

    await expect(
      fx.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`INSERT INTO ledger_posting_line (entry_id, line_no, account_id, amount)
          VALUES (${reversalId}, 3, ${c}, 50)`;
        await tx.$executeRaw`INSERT INTO ledger_posting_line (entry_id, line_no, account_id, amount)
          VALUES (${reversalId}, 4, ${c}, -50)`;
      }),
    ).rejects.toThrow(/LEDGER_REVERSAL_MISMATCH/);
  });

  it("refuse d'ajouter des lignes équilibrées à l'originale après son annulation", async () => {
    const a = await openSuspense();
    const b = await openSuspense();
    const c = await openSuspense();
    const originalId = randomUUID();
    await rawEntry(originalId, [
      [a, -100n],
      [b, 100n],
    ]);
    await rawEntry(
      randomUUID(),
      [
        [b, -100n],
        [a, 100n],
      ],
      originalId,
    );

    await expect(
      fx.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`INSERT INTO ledger_posting_line (entry_id, line_no, account_id, amount)
          VALUES (${originalId}, 3, ${c}, 50)`;
        await tx.$executeRaw`INSERT INTO ledger_posting_line (entry_id, line_no, account_id, amount)
          VALUES (${originalId}, 4, ${c}, -50)`;
      }),
    ).rejects.toThrow(/LEDGER_REVERSAL_MISMATCH/);
  });
});
