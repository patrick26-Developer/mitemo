import { CARD_TINT_BANDS, cardTintFor } from "./model.card-tint";

describe("cardTintFor", () => {
  it("donne une même couleur à chaque tranche de montant de pointage", () => {
    expect(cardTintFor(100n)).toBe(cardTintFor(999n));
    expect(cardTintFor(1_000n)).toBe(cardTintFor(5_999n));
    expect(cardTintFor(6_000n)).toBe(cardTintFor(19_999n));
    expect(cardTintFor(20_000n)).toBe(cardTintFor(49_999n));
    expect(cardTintFor(50_000n)).toBe(cardTintFor(5_000_000n));
  });

  it("change de couleur d'une tranche à l'autre, sans dépasser cinq teintes", () => {
    const tints = [999n, 1_000n, 6_000n, 20_000n, 50_000n].map(cardTintFor);

    expect(new Set(tints).size).toBe(5);
    expect(CARD_TINT_BANDS).toHaveLength(5);
  });
});
