import { toAmountMinor, toIsoDateTime } from "@mitemo/contracts";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { createJournalEntry, reverseEntry, type JournalEntry } from "./journal-entry.js";
import {
  DuplicateAccountError,
  DuplicateEntryError,
  InsufficientBalanceError,
  LedgerBook,
  UnknownAccountError,
} from "./ledger-book.js";

const AT = toIsoDateTime("2026-11-07T08:00:00.000Z");

interface Move {
  readonly from: string;
  readonly to: string;
  readonly amount: bigint;
}

function transfer(id: string, { from, to, amount }: Move): JournalEntry {
  return createJournalEntry({
    id,
    occurredAt: AT,
    description: "Mouvement de test",
    lines: [
      { accountId: from, amount: toAmountMinor(-amount) },
      { accountId: to, amount: toAmountMinor(amount) },
    ],
  });
}

function bookWithWalletAndClearing(): LedgerBook {
  const book = new LedgerBook();
  book.openAccount({ id: "wallet:grace", kind: "WALLET_USER" });
  book.openAccount({ id: "clearing:mtn", kind: "CLEARING_MTN" });
  return book;
}

describe("LedgerBook", () => {
  it("calcule le solde d'un compte à partir des écritures, sans solde stocké", () => {
    const book = bookWithWalletAndClearing();

    book.post(transfer("e1", { from: "clearing:mtn", to: "wallet:grace", amount: 5_000n }));
    book.post(transfer("e2", { from: "clearing:mtn", to: "wallet:grace", amount: 2_500n }));

    expect(book.balanceOf("wallet:grace")).toBe(7_500n);
    expect(book.balanceOf("clearing:mtn")).toBe(-7_500n);
  });

  it("renvoie un solde nul pour un compte ouvert sans mouvement", () => {
    expect(bookWithWalletAndClearing().balanceOf("wallet:grace")).toBe(0n);
  });

  it("refuse une écriture qui rendrait un portefeuille négatif, et n'écrit rien", () => {
    const book = bookWithWalletAndClearing();
    book.post(transfer("e1", { from: "clearing:mtn", to: "wallet:grace", amount: 1_000n }));

    expect(() =>
      book.post(transfer("e2", { from: "wallet:grace", to: "clearing:mtn", amount: 1_001n })),
    ).toThrow(InsufficientBalanceError);
    expect(book.balanceOf("wallet:grace")).toBe(1_000n);
    expect(book.entries()).toHaveLength(1);
  });

  it("autorise un compte de compensation à devenir négatif", () => {
    const book = bookWithWalletAndClearing();

    book.post(transfer("e1", { from: "clearing:mtn", to: "wallet:grace", amount: 1_000n }));

    expect(book.balanceOf("clearing:mtn")).toBe(-1_000n);
  });

  it("refuse une écriture sur un compte inconnu, et n'écrit rien", () => {
    const book = bookWithWalletAndClearing();

    expect(() =>
      book.post(transfer("e1", { from: "clearing:mtn", to: "wallet:inconnu", amount: 10n })),
    ).toThrow(UnknownAccountError);
    expect(book.entries()).toHaveLength(0);
    expect(() => book.balanceOf("wallet:inconnu")).toThrow(UnknownAccountError);
  });

  it("refuse d'enregistrer deux fois le même identifiant d'écriture", () => {
    const book = bookWithWalletAndClearing();
    book.post(transfer("e1", { from: "clearing:mtn", to: "wallet:grace", amount: 10n }));

    expect(() =>
      book.post(transfer("e1", { from: "clearing:mtn", to: "wallet:grace", amount: 10n })),
    ).toThrow(DuplicateEntryError);
    expect(book.balanceOf("wallet:grace")).toBe(10n);
  });

  it("refuse d'ouvrir deux fois le même compte", () => {
    const book = bookWithWalletAndClearing();

    expect(() => book.openAccount({ id: "wallet:grace", kind: "WALLET_USER" })).toThrow(
      DuplicateAccountError,
    );
  });

  it("corrige par contre-écriture : l'historique garde les deux écritures", () => {
    const book = bookWithWalletAndClearing();
    const original = transfer("e1", { from: "clearing:mtn", to: "wallet:grace", amount: 5_000n });
    book.post(original);

    book.post(reverseEntry(original, { id: "e2", occurredAt: AT, description: "Annulation" }));

    expect(book.balanceOf("wallet:grace")).toBe(0n);
    expect(book.entries().map((entry) => entry.id)).toEqual(["e1", "e2"]);
  });

  it("ne laisse pas modifier son historique depuis l'extérieur", () => {
    const book = bookWithWalletAndClearing();
    book.post(transfer("e1", { from: "clearing:mtn", to: "wallet:grace", amount: 10n }));

    expect(() => {
      (book.entries() as JournalEntry[]).pop();
    }).toThrow(TypeError);
    expect(book.entries()).toHaveLength(1);
  });

  it("garde une somme nulle et aucun portefeuille négatif, pour toute séquence (propriété)", () => {
    const accounts = ["wallet:a", "wallet:b", "wallet:c", "clearing:mtn"] as const;
    const move = fc.record({
      from: fc.constantFrom(...accounts),
      to: fc.constantFrom(...accounts),
      amount: fc.bigInt({ min: 1n, max: 50_000n }),
    });

    fc.assert(
      fc.property(fc.array(move, { maxLength: 40 }), (moves) => {
        const book = new LedgerBook();
        for (const id of accounts) {
          book.openAccount({ id, kind: id.startsWith("wallet") ? "WALLET_USER" : "CLEARING_MTN" });
        }

        moves.forEach((step, index) => {
          if (step.from === step.to) return;
          try {
            book.post(
              transfer(`e${String(index)}`, { from: step.from, to: step.to, amount: step.amount }),
            );
          } catch (error) {
            if (!(error instanceof InsufficientBalanceError)) throw error;
          }
        });

        const total = accounts.reduce((sum, id) => sum + book.balanceOf(id), 0n);
        expect(total).toBe(0n);
        for (const id of accounts.filter((account) => account.startsWith("wallet"))) {
          expect(book.balanceOf(id) >= 0n).toBe(true);
        }
      }),
    );
  });
});
