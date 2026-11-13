import { contributionCharge, contributionFee, markerFee } from "./model.contribution-fee";

describe("contributionFee", () => {
  it("ajoute 10 % à la cotisation du membre : 500 FCFA en coûtent 550", () => {
    expect(contributionFee(500n)).toBe(50n);
    expect(contributionFee(5_000n)).toBe(500n);
  });

  it("répartit entre les membres 10 % du tour : cinq membres à 500 FCFA paient 250 FCFA de frais", () => {
    const members = 5n;
    const round = 500n * members;

    expect(contributionFee(500n) * members).toBe((round * 10n) / 100n);
  });

  it("arrondit au franc inférieur une cotisation qui ne tombe pas juste", () => {
    expect(contributionFee(505n)).toBe(50n);
  });
});

describe("markerFee", () => {
  it("répartit les frais de la carte sur ses pointages : 3 000 FCFA en 6 font 500 par pointage", () => {
    const card = { fee: 3_000n, markersTotal: 6 };

    expect([0, 1, 2, 3, 4, 5].map((index) => markerFee(card, index))).toEqual([
      500n,
      500n,
      500n,
      500n,
      500n,
      500n,
    ]);
  });

  it("place le reste sur les premiers pointages, au franc près", () => {
    const card = { fee: 1_000n, markersTotal: 3 };

    expect([0, 1, 2].map((index) => markerFee(card, index))).toEqual([334n, 333n, 333n]);
  });

  it("additionne toujours exactement les frais de la carte, sans jamais dépasser d'un franc l'écart entre pointages", () => {
    for (let markersTotal = 1; markersTotal <= 60; markersTotal += 1) {
      for (const fee of [0n, 1n, 7n, 999n, 6_000n, 123_457n, 1_000_003n]) {
        const shares = Array.from({ length: markersTotal }, (_, index) =>
          markerFee({ fee, markersTotal }, index),
        );
        const total = shares.reduce((sum, share) => sum + share, 0n);
        const spread =
          shares.reduce((max, share) => (share > max ? share : max), 0n) -
          shares.reduce((min, share) => (share < min ? share : min), fee);

        expect(total).toBe(fee);
        expect(spread <= 1n).toBe(true);
      }
    }
  });

  it("ne demande aucun frais au-delà du dernier pointage", () => {
    expect(markerFee({ fee: 3_000n, markersTotal: 6 }, 6)).toBe(0n);
  });
});

describe("contributionCharge", () => {
  it("rend le montant réellement prélevé : la cotisation et sa part des frais", () => {
    expect(contributionCharge(5_000n)).toBe(5_500n);
  });
});
