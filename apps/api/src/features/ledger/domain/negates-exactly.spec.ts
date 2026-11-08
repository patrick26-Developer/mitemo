import { toAmountMinor, toIsoDateTime } from "@mitemo/contracts";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { createJournalEntry, negatesExactly, reverseEntry } from "./journal-entry.js";

const OCCURRED_AT = toIsoDateTime("2026-11-07T08:00:00.000Z");

describe("negatesExactly", () => {
  it("reconnaît une contre-écriture exacte quel que soit l'ordre des lignes", () => {
    const original = createJournalEntry({
      id: "entry-1",
      occurredAt: OCCURRED_AT,
      description: "Écriture d'origine",
      lines: [
        { accountId: "wallet:grace", amount: toAmountMinor(-300n) },
        { accountId: "caisse:carte", amount: toAmountMinor(200n) },
        { accountId: "clearing:mtn", amount: toAmountMinor(100n) },
      ],
    });
    const reversal = [
      { accountId: "clearing:mtn", amount: toAmountMinor(-100n) },
      { accountId: "wallet:grace", amount: toAmountMinor(300n) },
      { accountId: "caisse:carte", amount: toAmountMinor(-200n) },
    ];

    expect(negatesExactly(original.lines, reversal)).toBe(true);
  });

  it("respecte la multiplicité des lignes identiques", () => {
    const original = [
      { accountId: "wallet:grace", amount: toAmountMinor(-100n) },
      { accountId: "wallet:grace", amount: toAmountMinor(-100n) },
      { accountId: "clearing:mtn", amount: toAmountMinor(200n) },
    ];

    expect(
      negatesExactly(original, [
        { accountId: "clearing:mtn", amount: toAmountMinor(-200n) },
        { accountId: "wallet:grace", amount: toAmountMinor(100n) },
        { accountId: "wallet:grace", amount: toAmountMinor(100n) },
      ]),
    ).toBe(true);
    expect(
      negatesExactly(original, [
        { accountId: "clearing:mtn", amount: toAmountMinor(-200n) },
        { accountId: "wallet:grace", amount: toAmountMinor(100n) },
      ]),
    ).toBe(false);
  });

  it("refuse une ligne dont le compte ou le montant diffère", () => {
    const original = [
      { accountId: "wallet:grace", amount: toAmountMinor(-100n) },
      { accountId: "clearing:mtn", amount: toAmountMinor(100n) },
    ];

    expect(
      negatesExactly(original, [
        { accountId: "wallet:grace", amount: toAmountMinor(99n) },
        { accountId: "clearing:mtn", amount: toAmountMinor(-99n) },
      ]),
    ).toBe(false);
    expect(
      negatesExactly(original, [
        { accountId: "wallet:autre", amount: toAmountMinor(100n) },
        { accountId: "clearing:mtn", amount: toAmountMinor(-100n) },
      ]),
    ).toBe(false);
  });

  it("reconnaît toute contre-écriture produite par reverseEntry (propriété)", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.bigInt({ min: -10_000_000n, max: 10_000_000n }).filter((n) => n !== 0n),
          { minLength: 2, maxLength: 8 },
        ),
        (amounts) => {
          const balanced = [...amounts, -amounts.reduce((sum, amount) => sum + amount, 0n)].filter(
            (amount) => amount !== 0n,
          );
          fc.pre(balanced.length >= 2);
          const original = createJournalEntry({
            id: "entry-1",
            occurredAt: OCCURRED_AT,
            description: "Écriture d'origine",
            lines: balanced.map((amount, index) => ({
              accountId: `account:${String(index)}`,
              amount: toAmountMinor(amount),
            })),
          });
          const reversal = reverseEntry(original, {
            id: "entry-2",
            occurredAt: OCCURRED_AT,
            description: "Annulation",
          });

          expect(negatesExactly(original.lines, reversal.lines)).toBe(true);
        },
      ),
    );
  });
});
