import { maskAmountText } from "./model.amount-mask";

describe("maskAmountText", () => {
  it("masque chaque chiffre et garde les espaces de milliers", () => {
    const masked = maskAmountText("12 500");

    expect(masked).toHaveLength(6);
    expect(masked[2]).toBe(" ");
    expect(masked).not.toMatch(/\d/);
  });

  it("est déterministe pour un même montant", () => {
    expect(maskAmountText("12 500")).toBe(maskAmountText("12 500"));
  });

  it("masque différemment deux montants de même longueur", () => {
    expect(maskAmountText("100")).not.toBe(maskAmountText("200"));
  });

  it("laisse la devise et les séparateurs", () => {
    expect(maskAmountText("5 000 FCFA")).toContain(" FCFA");
    expect(maskAmountText("5 000")).not.toMatch(/[0-9]/);
  });
});
