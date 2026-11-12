import { cardCreationFee } from "./model.card-fee";

describe("cardCreationFee", () => {
  it("prend 10 % de l'objectif à la création", () => {
    expect(cardCreationFee(60_000n)).toBe(6_000n);
  });

  it("arrondit au franc inférieur, sans flottant", () => {
    expect(cardCreationFee(12_345n)).toBe(1_234n);
    expect(cardCreationFee(0n)).toBe(0n);
  });
});
