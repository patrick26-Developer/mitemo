import { parseAmountInput } from "./model.amount-input";

describe("parseAmountInput", () => {
  it("lit un montant entier", () => {
    expect(parseAmountInput("5000")).toBe(5_000n);
  });

  it("tolère les espaces de milliers", () => {
    expect(parseAmountInput("12 500")).toBe(12_500n);
    expect(parseAmountInput("12\u00a0500")).toBe(12_500n);
  });

  it("refuse une saisie vide", () => {
    expect(parseAmountInput("")).toBeNull();
  });

  it("refuse zéro et les montants négatifs", () => {
    expect(parseAmountInput("0")).toBeNull();
    expect(parseAmountInput("-500")).toBeNull();
  });

  it("refuse les décimales et les séparateurs", () => {
    expect(parseAmountInput("5,5")).toBeNull();
    expect(parseAmountInput("5.5")).toBeNull();
  });
});
