import { parseCountInput } from "./model.count-input";

describe("parseCountInput", () => {
  it("lit un entier positif", () => {
    expect(parseCountInput("10", 100)).toBe(10);
  });

  it("tolère les espaces autour de la saisie", () => {
    expect(parseCountInput(" 3 ", 10)).toBe(3);
  });

  it("refuse une saisie vide ou non numérique", () => {
    expect(parseCountInput("", 10)).toBeNull();
    expect(parseCountInput("trois", 10)).toBeNull();
  });

  it("refuse zéro et les nombres négatifs", () => {
    expect(parseCountInput("0", 10)).toBeNull();
    expect(parseCountInput("-2", 10)).toBeNull();
  });

  it("refuse une valeur au-dessus de la borne", () => {
    expect(parseCountInput("11", 10)).toBeNull();
    expect(parseCountInput("10", 10)).toBe(10);
  });
});
