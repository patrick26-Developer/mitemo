import { bigintReplacer, bigintReviver } from "./model.bigint-json";

describe("sérialisation des montants", () => {
  it("sérialise un bigint sans passer par un flottant", () => {
    const json = JSON.stringify({ amount: 12_500n }, bigintReplacer);

    expect(json).toBe('{"amount":{"__bigint":"12500"}}');
  });

  it("relit un bigint à l'identique", () => {
    const raw = '{"amount":{"__bigint":"12500"}}';

    expect(JSON.parse(raw, bigintReviver)).toEqual({ amount: 12_500n });
  });

  it("laisse les autres valeurs intactes", () => {
    const value = { name: "Tontine", count: 3, active: true };

    expect(JSON.parse(JSON.stringify(value, bigintReplacer), bigintReviver)).toEqual(value);
  });

  it("relit un montant négatif", () => {
    expect(JSON.parse('{"amount":{"__bigint":"-500"}}', bigintReviver)).toEqual({
      amount: -500n,
    });
  });
});
