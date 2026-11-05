import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InvalidAmountError, parseAmount, serializeAmount, toAmountMinor } from "./money.ts";
import type { AmountMinor } from "./money.ts";

describe("parseAmount", () => {
  it("lit un montant entier positif", () => {
    assert.equal(parseAmount("5000"), 5000n);
  });

  it("lit un montant négatif (écriture de débit)", () => {
    assert.equal(parseAmount("-1500"), -1500n);
  });

  it("conserve la précision au-delà de Number.MAX_SAFE_INTEGER", () => {
    assert.equal(parseAmount("9007199254740993"), 9007199254740993n);
  });

  for (const raw of ["", "12.5", "1e3", " 10", "+10", "007", "-0", "abc"]) {
    it(`refuse ${JSON.stringify(raw)}`, () => {
      assert.throws(() => parseAmount(raw), InvalidAmountError);
    });
  }

  it("garde la valeur fautive dans l'erreur", () => {
    assert.throws(() => parseAmount("12.5"), { raw: "12.5" });
  });
});

describe("serializeAmount", () => {
  it("produit la forme lue par parseAmount", () => {
    const amount = toAmountMinor(-250n);

    assert.equal(parseAmount(serializeAmount(amount)), amount);
  });
});

describe("AmountMinor", () => {
  it("n'accepte pas un bigint brut sans passer par toAmountMinor", () => {
    // @ts-expect-error un bigint brut n'a pas la marque AmountMinor
    const raw: AmountMinor = 10n;

    assert.equal(typeof raw, "bigint");
  });
});
