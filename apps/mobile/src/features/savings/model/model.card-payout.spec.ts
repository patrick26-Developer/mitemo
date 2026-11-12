import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { cardPayoutRequest } from "./model.card-payout";

describe("cardPayoutRequest", () => {
  it("récapitule la carte et retire toute son épargne, à sa teinte", () => {
    const card = makeCard({ name: "Loyer", saved: 30_000n, tint: "#CDF5DD" });

    expect(cardPayoutRequest(card)).toEqual({
      title: "Retirer",
      recapTitle: "Retrait",
      rows: [
        { label: "Carte", value: "Loyer" },
        { label: "Montant", value: expect.stringMatching(/^30.000 FCFA$/) },
      ],
      amount: 30_000n,
      accent: "#CDF5DD",
    });
  });
});
