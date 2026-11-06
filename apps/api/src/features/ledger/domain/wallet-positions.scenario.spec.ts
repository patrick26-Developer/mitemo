import { toAmountMinor, toIsoDateTime } from "@mitemo/contracts";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { createJournalEntry } from "./journal-entry.js";
import { InsufficientBalanceError, LedgerBook } from "./ledger-book.js";

// Vérifie, sur le grand livre, la définition comptable des soldes du
// portefeuille publiée dans @mitemo/contracts (wallet.ts) :
// - disponible = compte WALLET_USER de l'utilisateur ;
// - affecté    = caisses de SES cartes de pointage personnelles ;
// - bloqué     = son compte de garantie (aucune garantie dans la démonstration) ;
// - en attente = approvisionnements non confirmés : aucune écriture, donc hors grand livre.
// Chaque solde lit des comptes distincts : aucun montant ne compte deux fois.

const AT = toIsoDateTime("2026-11-08T09:00:00.000Z");

const ACCOUNTS = {
  clearing: "clearing:simulateur",
  wallet: "wallet:grace",
  card: "caisse:carte-rentree",
  guarantee: "guarantee:grace",
  ristourne: "caisse:ristourne-marche",
} as const;

function newBook(): LedgerBook {
  const book = new LedgerBook();
  book.openAccount({ id: ACCOUNTS.clearing, kind: "CLEARING_SIMULATOR" });
  book.openAccount({ id: ACCOUNTS.wallet, kind: "WALLET_USER" });
  book.openAccount({ id: ACCOUNTS.card, kind: "SAVINGS_CARD_CAISSE" });
  book.openAccount({ id: ACCOUNTS.guarantee, kind: "GUARANTEE_MEMBER" });
  book.openAccount({ id: ACCOUNTS.ristourne, kind: "RISTOURNE_CAISSE" });
  return book;
}

let sequence = 0;
function move(book: LedgerBook, route: { from: string; to: string }, amount: bigint): void {
  sequence += 1;
  book.post(
    createJournalEntry({
      id: `e${String(sequence)}`,
      occurredAt: AT,
      description: "Scénario",
      lines: [
        { accountId: route.from, amount: toAmountMinor(-amount) },
        { accountId: route.to, amount: toAmountMinor(amount) },
      ],
    }),
  );
}

function positions(book: LedgerBook): { available: bigint; committed: bigint; blocked: bigint } {
  return {
    available: book.balanceOf(ACCOUNTS.wallet),
    committed: book.balanceOf(ACCOUNTS.card),
    blocked: book.balanceOf(ACCOUNTS.guarantee),
  };
}

const FUND = { from: ACCOUNTS.clearing, to: ACCOUNTS.wallet };
const INSTALLMENT = { from: ACCOUNTS.wallet, to: ACCOUNTS.card };
const CONTRIBUTION = { from: ACCOUNTS.wallet, to: ACCOUNTS.ristourne };

describe("soldes du portefeuille, scénario chiffré", () => {
  it("un versement passe du disponible à l'affecté, sans compter deux fois", () => {
    const book = newBook();
    move(book, FUND, 10_000n); // approvisionnement simulé confirmé
    move(book, INSTALLMENT, 500n); // versement de la carte
    move(book, INSTALLMENT, 500n);
    move(book, CONTRIBUTION, 2_000n); // contribution à la ristourne

    expect(positions(book)).toEqual({ available: 7_000n, committed: 1_000n, blocked: 0n });
    // La contribution appartient à la caisse collective, pas au portefeuille.
    expect(book.balanceOf(ACCOUNTS.ristourne)).toBe(2_000n);
    // 7 000 + 1 000 + 0 + 2 000 = les 10 000 approvisionnés : rien ne manque, rien en double.
    const { available, committed, blocked } = positions(book);
    expect(available + committed + blocked + book.balanceOf(ACCOUNTS.ristourne)).toBe(10_000n);
  });

  it("un approvisionnement en attente n'apparaît dans aucun solde du grand livre", () => {
    const book = newBook();
    move(book, FUND, 10_000n);

    // 5 000 FCFA en attente : aucune écriture tant que le simulateur n'a pas confirmé.
    expect(positions(book)).toEqual({ available: 10_000n, committed: 0n, blocked: 0n });
  });

  it("un versement ne peut pas dépasser le disponible", () => {
    const book = newBook();
    move(book, FUND, 400n);

    expect(() => {
      move(book, INSTALLMENT, 500n);
    }).toThrow(InsufficientBalanceError);
    expect(positions(book)).toEqual({ available: 400n, committed: 0n, blocked: 0n });
  });

  it("pour toute séquence, les soldes restent disjoints et la somme est conservée (propriété)", () => {
    const step = fc.record({
      route: fc.constantFrom(FUND, INSTALLMENT, CONTRIBUTION),
      amount: fc.bigInt({ min: 1n, max: 20_000n }),
    });

    fc.assert(
      fc.property(fc.array(step, { maxLength: 30 }), (steps) => {
        const book = newBook();
        let funded = 0n;
        for (const { route, amount } of steps) {
          try {
            move(book, route, amount);
            if (route === FUND) funded += amount;
          } catch (error) {
            if (!(error instanceof InsufficientBalanceError)) throw error;
          }
        }
        const { available, committed, blocked } = positions(book);
        expect(available >= 0n && committed >= 0n).toBe(true);
        expect(blocked).toBe(0n);
        expect(available + committed + book.balanceOf(ACCOUNTS.ristourne)).toBe(funded);
      }),
    );
  });
});
