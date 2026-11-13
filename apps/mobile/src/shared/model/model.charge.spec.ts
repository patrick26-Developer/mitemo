import { chargeRow } from "./model.charge";

describe("chargeRow", () => {
  it("affiche un seul montant à régler, frais compris, sans ligne de frais", () => {
    expect(chargeRow("Cotisation", 500n, 50n)).toEqual({
      row: { label: "Cotisation", value: "550 FCFA" },
      total: 550n,
    });
  });
});
