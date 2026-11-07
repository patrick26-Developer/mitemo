import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  insertRawEntry,
  openAccount,
  useLedgerDatabase,
} from "../../../../test/int/ledger-fixtures.js";
import {
  LEDGER_ACCOUNT_KINDS,
  NON_NEGATIVE_KINDS,
  type LedgerAccountKind,
} from "../domain/ledger-book.js";

// Ces tests écrivent en SQL direct : ils prouvent que la base applique
// exactement NON_NEGATIVE_KINDS, sans dérive avec le domaine TypeScript.

const fx = useLedgerDatabase();
const open = (kind: LedgerAccountKind): Promise<string> => openAccount(fx, kind);

function rawEntry(id: string, lines: readonly [string, bigint][]): Promise<void> {
  return insertRawEntry(fx, id, { lines });
}

describe("soldes non négatifs garantis par la base", () => {
  it("refuse un portefeuille négatif même par insertion SQL directe", async () => {
    const wallet = await open("WALLET_USER");
    const clearing = await open("CLEARING_SIMULATOR");
    await rawEntry(randomUUID(), [
      [clearing, -100n],
      [wallet, 100n],
    ]);

    await expect(
      rawEntry(randomUUID(), [
        [wallet, -101n],
        [clearing, 101n],
      ]),
    ).rejects.toThrow(/LEDGER_NEGATIVE_BALANCE/);
    expect(await fx.repository.balanceOf(wallet)).toBe(100n);
  });

  it.each(["SAVINGS_CARD_CAISSE", "RISTOURNE_CAISSE"] as const)(
    "refuse un découvert de %s même par insertion SQL directe",
    async (kind) => {
      const account = await open(kind);
      const clearing = await open("CLEARING_SIMULATOR");
      await rawEntry(randomUUID(), [
        [clearing, -100n],
        [account, 100n],
      ]);

      await expect(
        rawEntry(randomUUID(), [
          [account, -101n],
          [clearing, 101n],
        ]),
      ).rejects.toThrow(/LEDGER_NEGATIVE_BALANCE/);
      expect(await fx.repository.balanceOf(account)).toBe(100n);
    },
  );

  it("applique exactement NON_NEGATIVE_KINDS aux soldes négatifs", async () => {
    for (const kind of LEDGER_ACCOUNT_KINDS) {
      const account = await open(kind);
      const clearing = await open("CLEARING_SIMULATOR");
      await rawEntry(randomUUID(), [
        [clearing, -100n],
        [account, 100n],
      ]);
      const overdraft = rawEntry(randomUUID(), [
        [account, -101n],
        [clearing, 101n],
      ]);

      if (NON_NEGATIVE_KINDS.has(kind)) {
        await expect(overdraft).rejects.toThrow(/LEDGER_NEGATIVE_BALANCE/);
        expect(await fx.repository.balanceOf(account)).toBe(100n);
      } else {
        await overdraft;
        expect(await fx.repository.balanceOf(account)).toBe(-1n);
      }
    }
  });
});
