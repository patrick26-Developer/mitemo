import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  AT,
  command,
  fundedWallet as funded,
  openAccount,
  transfer,
  unique,
  useLedgerDatabase,
} from "../../../../test/int/ledger-fixtures.js";
import { reverseEntry } from "../domain/journal-entry.js";
import {
  InsufficientBalanceError,
  UnknownAccountError,
  type LedgerAccountKind,
} from "../domain/ledger-book.js";
import { ClosedAccountError, IdempotencyConflictError } from "../domain/ledger.repository.js";

const fx = useLedgerDatabase();
const open = (kind: LedgerAccountKind): Promise<string> => openAccount(fx, kind);
const fundedWallet = (amount: bigint): Promise<{ wallet: string; clearing: string }> =>
  funded(fx, amount);
const entryCount = (accountId: string): Promise<number> =>
  fx.prisma.ledgerPostingLine.count({ where: { accountId } });

describe("PrismaLedgerRepository — enregistrement", () => {
  it("enregistre une écriture équilibrée et calcule les soldes exacts", async () => {
    const { wallet, clearing } = await fundedWallet(5_000n);
    await fx.repository.post(command(transfer(clearing, wallet, 2_500n)));

    expect(await fx.repository.balanceOf(wallet)).toBe(7_500n);
    expect(await fx.repository.balanceOf(clearing)).toBe(-7_500n);
  });

  it("enregistre les métadonnées d'audit et la date métier", async () => {
    const clearing = await open("CLEARING_SIMULATOR");
    const wallet = await open("WALLET_USER");
    const entry = transfer(clearing, wallet, 100n);

    const key = `cle-audit-${entry.id}`;
    await fx.repository.post({ ...command(entry, key), recordedBy: "simulateur" });

    const stored = await fx.prisma.ledgerEntry.findUniqueOrThrow({ where: { id: entry.id } });
    expect(stored.occurredAt.toISOString()).toBe(AT);
    expect(stored.recordedBy).toBe("simulateur");
    expect(stored.settlementMode).toBe("SIMULATED");
    expect(stored.operationRef).toBe(`test:${key}`);
  });

  it("refuse un compte inconnu, sans rien écrire", async () => {
    const wallet = await open("WALLET_USER");

    await expect(
      fx.repository.post(command(transfer(unique("inconnu"), wallet, 10n))),
    ).rejects.toBeInstanceOf(UnknownAccountError);
    expect(await entryCount(wallet)).toBe(0);
    await expect(fx.repository.balanceOf(unique("inconnu"))).rejects.toBeInstanceOf(
      UnknownAccountError,
    );
  });

  it("refuse un compte clôturé, sans rien écrire", async () => {
    const { wallet, clearing } = await fundedWallet(1_000n);
    await fx.repository.closeAccount(clearing);

    await expect(
      fx.repository.post(command(transfer(clearing, wallet, 10n))),
    ).rejects.toBeInstanceOf(ClosedAccountError);
    expect(await fx.repository.balanceOf(wallet)).toBe(1_000n);
  });

  it("refuse un portefeuille négatif, sans écriture partielle", async () => {
    const { wallet, clearing } = await fundedWallet(1_000n);
    const before = await entryCount(wallet);

    await expect(
      fx.repository.post(command(transfer(wallet, clearing, 1_001n))),
    ).rejects.toBeInstanceOf(InsufficientBalanceError);
    expect(await fx.repository.balanceOf(wallet)).toBe(1_000n);
    expect(await entryCount(wallet)).toBe(before);
  });

  it("corrige par contre-écriture, une seule fois par écriture", async () => {
    const clearing = await open("CLEARING_SIMULATOR");
    const wallet = await open("WALLET_USER");
    const original = transfer(clearing, wallet, 5_000n);
    await fx.repository.post(command(original));
    const meta = { occurredAt: AT, description: "Annulation : erreur de saisie" };

    await fx.repository.post(command(reverseEntry(original, { ...meta, id: randomUUID() })));
    expect(await fx.repository.balanceOf(wallet)).toBe(0n);

    await expect(
      fx.repository.post(command(reverseEntry(original, { ...meta, id: randomUUID() }))),
    ).rejects.toThrow(/déjà annulée/);
    expect(await fx.repository.balanceOf(wallet)).toBe(0n);
  });
});

describe("PrismaLedgerRepository — idempotence", () => {
  it("ne produit qu'une écriture pour une demande rejouée", async () => {
    const clearing = await open("CLEARING_SIMULATOR");
    const wallet = await open("WALLET_USER");
    const key = randomUUID();

    const first = await fx.repository.post(command(transfer(clearing, wallet, 700n), key));
    // Rejouée : nouvel identifiant d'écriture, même contenu, même clé.
    const second = await fx.repository.post(command(transfer(clearing, wallet, 700n), key));

    expect(first.status).toBe("RECORDED");
    expect(second).toEqual({ status: "REPLAYED", entryId: first.entryId });
    expect(await fx.repository.balanceOf(wallet)).toBe(700n);
  });

  it("refuse une clé réutilisée avec un autre contenu", async () => {
    const clearing = await open("CLEARING_SIMULATOR");
    const wallet = await open("WALLET_USER");
    const key = randomUUID();
    await fx.repository.post(command(transfer(clearing, wallet, 700n), key));

    await expect(
      fx.repository.post(command(transfer(clearing, wallet, 701n), key)),
    ).rejects.toBeInstanceOf(IdempotencyConflictError);
    expect(await fx.repository.balanceOf(wallet)).toBe(700n);
  });

  it("deux demandes concurrentes avec la même clé ne produisent qu'une écriture", async () => {
    const clearing = await open("CLEARING_SIMULATOR");
    const wallet = await open("WALLET_USER");
    const key = randomUUID();

    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        fx.repository.post(command(transfer(clearing, wallet, 300n), key)),
      ),
    );

    expect(results.filter((result) => result.status === "RECORDED")).toHaveLength(1);
    expect(new Set(results.map((result) => result.entryId)).size).toBe(1);
    expect(await fx.repository.balanceOf(wallet)).toBe(300n);
  });
});

describe("PrismaLedgerRepository — concurrence", () => {
  it("des débits concurrents ne rendent jamais un portefeuille négatif", async () => {
    const { wallet, clearing } = await fundedWallet(1_000n);

    const outcomes = await Promise.allSettled(
      Array.from({ length: 6 }, () =>
        fx.repository.post(command(transfer(wallet, clearing, 300n))),
      ),
    );

    const succeeded = outcomes.filter((outcome) => outcome.status === "fulfilled");
    const refused = outcomes.filter((outcome) => outcome.status === "rejected");
    expect(succeeded).toHaveLength(3);
    for (const outcome of refused) {
      expect(outcome.reason).toBeInstanceOf(InsufficientBalanceError);
    }
    expect(await fx.repository.balanceOf(wallet)).toBe(100n);
  });
});
