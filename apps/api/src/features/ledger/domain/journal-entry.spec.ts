import { toAmountMinor, toIsoDateTime } from "@mitemo/contracts";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  createJournalEntry,
  InvalidEntryError,
  reverseEntry,
  UnbalancedEntryError,
  type JournalEntryInput,
} from "./journal-entry.js";

const OCCURRED_AT = toIsoDateTime("2026-11-07T08:00:00.000Z");

function funding(amount: bigint): JournalEntryInput {
  return {
    id: "entry-1",
    occurredAt: OCCURRED_AT,
    description: "Approvisionnement simulé",
    lines: [
      { accountId: "wallet:grace", amount: toAmountMinor(amount) },
      { accountId: "clearing:mtn", amount: toAmountMinor(-amount) },
    ],
  };
}

describe("createJournalEntry", () => {
  it("accepte une écriture équilibrée de deux imputations", () => {
    const entry = createJournalEntry(funding(5_000n));

    expect(entry.id).toBe("entry-1");
    expect(entry.lines).toHaveLength(2);
    expect(entry.lines.reduce((sum, line) => sum + line.amount, 0n)).toBe(0n);
  });

  it("refuse une écriture dont la somme n'est pas nulle", () => {
    const input: JournalEntryInput = {
      ...funding(5_000n),
      lines: [
        { accountId: "wallet:grace", amount: toAmountMinor(5_000n) },
        { accountId: "clearing:mtn", amount: toAmountMinor(-4_999n) },
      ],
    };

    expect(() => createJournalEntry(input)).toThrow(UnbalancedEntryError);
  });

  it("refuse une écriture de moins de deux imputations", () => {
    const input: JournalEntryInput = {
      ...funding(0n),
      lines: [{ accountId: "wallet:grace", amount: toAmountMinor(0n) }],
    };

    expect(() => createJournalEntry(input)).toThrow(InvalidEntryError);
  });

  it("refuse une imputation de montant nul", () => {
    const input: JournalEntryInput = {
      ...funding(0n),
      lines: [
        { accountId: "wallet:grace", amount: toAmountMinor(0n) },
        { accountId: "clearing:mtn", amount: toAmountMinor(0n) },
      ],
    };

    expect(() => createJournalEntry(input)).toThrow(InvalidEntryError);
  });

  it("refuse une écriture sans identifiant ou sans libellé", () => {
    expect(() => createJournalEntry({ ...funding(100n), id: "" })).toThrow(InvalidEntryError);
    expect(() => createJournalEntry({ ...funding(100n), description: " " })).toThrow(
      InvalidEntryError,
    );
  });

  it("ne peut plus être modifiée une fois créée", () => {
    const entry = createJournalEntry(funding(5_000n));

    expect(() => {
      (entry as { description: string }).description = "modifiée";
    }).toThrow(TypeError);
    expect(() => {
      (entry.lines as unknown[]).push({ accountId: "x", amount: 1n });
    }).toThrow(TypeError);
    expect(() => {
      (entry.lines[0] as { amount: bigint }).amount = 1n;
    }).toThrow(TypeError);
  });

  it("n'est pas affectée par une modification ultérieure des données d'entrée", () => {
    const input = funding(5_000n);
    const lines = [...input.lines];
    const entry = createJournalEntry({ ...input, lines });

    lines.pop();

    expect(entry.lines).toHaveLength(2);
  });

  it("refuse toute écriture déséquilibrée, quels que soient les montants (propriété)", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.bigInt({ min: -10_000_000n, max: 10_000_000n }).filter((n) => n !== 0n),
          {
            minLength: 2,
            maxLength: 8,
          },
        ),
        (amounts) => {
          fc.pre(amounts.reduce((sum, amount) => sum + amount, 0n) !== 0n);
          const input: JournalEntryInput = {
            ...funding(0n),
            lines: amounts.map((amount, index) => ({
              accountId: `account:${String(index)}`,
              amount: toAmountMinor(amount),
            })),
          };
          expect(() => createJournalEntry(input)).toThrow(UnbalancedEntryError);
        },
      ),
    );
  });
});

describe("reverseEntry", () => {
  it("produit une contre-écriture qui annule exactement l'originale", () => {
    const original = createJournalEntry(funding(5_000n));

    const reversal = reverseEntry(original, {
      id: "entry-2",
      occurredAt: toIsoDateTime("2026-11-07T09:00:00.000Z"),
      description: "Annulation : erreur de saisie",
    });

    expect(reversal.reverses).toBe("entry-1");
    expect(reversal.lines).toEqual([
      { accountId: "wallet:grace", amount: -5_000n },
      { accountId: "clearing:mtn", amount: 5_000n },
    ]);
  });

  it("refuse d'annuler une écriture par elle-même", () => {
    const original = createJournalEntry(funding(5_000n));

    expect(() =>
      reverseEntry(original, { id: "entry-1", occurredAt: OCCURRED_AT, description: "x" }),
    ).toThrow(InvalidEntryError);
  });
});
