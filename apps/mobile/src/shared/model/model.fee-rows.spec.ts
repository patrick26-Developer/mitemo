import { feeRows } from "./model.fee-rows";

describe("feeRows", () => {
  it("détaille le montant, les frais Mitemo et le total à régler", () => {
    expect(feeRows("Cotisation", 500n, 50n)).toEqual({
      rows: [
        { label: "Cotisation", value: expect.stringMatching(/^500 FCFA$/) },
        { label: "Frais Mitemo (10 %)", value: expect.stringMatching(/^50 FCFA$/) },
        { label: "Total", value: expect.stringMatching(/^550 FCFA$/) },
      ],
      total: 550n,
    });
  });
});
