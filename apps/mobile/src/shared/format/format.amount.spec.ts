import { formatAmount } from "./format.amount";

describe("formatAmount", () => {
  it("laisse un montant de moins de quatre chiffres inchangé", () => {
    expect(formatAmount(999n)).toBe("999");
  });

  it("sépare les milliers par une espace", () => {
    expect(formatAmount(12_500n)).toBe("12 500");
  });

  it("sépare chaque groupe de milliers", () => {
    expect(formatAmount(1_234_567n)).toBe("1 234 567");
  });

  it("formate zéro", () => {
    expect(formatAmount(0n)).toBe("0");
  });
});
