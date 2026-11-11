import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { cardPayRequest } from "./model.card-pay";

describe("cardPayRequest", () => {
  it("décrit le prochain pointage, à la couleur de la carte", () => {
    const request = cardPayRequest(
      makeCard({ name: "Loyer", markerAmount: 5_000n, markersTotal: 6, tint: "#CDF5DD" }),
    );

    expect(request).toEqual({
      title: "Pointer",
      recapTitle: "Pointage",
      rows: [
        { label: "Carte", value: "Loyer" },
        { label: "Pointage", value: "5 sur 6" },
        { label: "Montant", value: "5 000 FCFA" },
      ],
      amount: 5_000n,
      accent: "#CDF5DD",
    });
  });
});
