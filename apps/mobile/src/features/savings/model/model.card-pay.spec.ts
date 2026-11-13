import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { cardPayRequest, markerCharge } from "./model.card-pay";

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
        { label: "À régler", value: "5 500 FCFA" },
      ],
      amount: 5_500n,
      accent: "#CDF5DD",
    });
  });
});

describe("markerCharge", () => {
  it("rend le montant réellement prélevé au prochain pointage, sa part des frais comprise", () => {
    expect(markerCharge(makeCard({ markerAmount: 5_000n, markersTotal: 6, fee: 3_000n }))).toBe(
      5_500n,
    );
  });
});
