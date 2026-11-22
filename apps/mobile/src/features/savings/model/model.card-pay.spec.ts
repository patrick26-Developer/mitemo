import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { cardPayRequest } from "./model.card-pay";

describe("cardPayRequest", () => {
  it("décrit le prochain pointage et sa part des frais de la carte, à la couleur de la carte", () => {
    const request = cardPayRequest(
      makeCard({ name: "Loyer", markerAmount: 5_000n, markersTotal: 6, tint: "#CDF5DD" }),
    );

    expect(request).toEqual({
      title: "Pointer",
      recapTitle: "Pointage",
      rows: [
        { label: "Carte", value: "Loyer" },
        { label: "Pointage", value: "5 sur 6" },
        { label: "Pointage du jour", value: "5 000 FCFA" },
        { label: "Frais Mitemo (10 %)", value: "500 FCFA" },
        { label: "Total", value: "5 500 FCFA" },
      ],
      amount: 5_500n,
      accent: "#CDF5DD",
    });
  });
});
