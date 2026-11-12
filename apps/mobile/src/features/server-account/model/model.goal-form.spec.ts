import { goalRequest } from "./model.goal-form";

const form = { name: "Fournitures", amount: "500", installments: "3", startsAt: "2026-11-30" };
describe("création d'un objectif sans paiement", () => {
  it("sérialise des XAF entiers et une première échéance UTC", () => {
    expect(goalRequest(form)).toEqual({
      name: "Fournitures",
      terms: {
        installmentAmount: { amount: "500", currency: "XAF" },
        frequency: "MONTHLY",
        installmentsPerCycle: 3,
        cycleCount: 1,
        startsAt: "2026-11-30T00:00:00.000Z",
      },
    });
  });
  it.each(["0", "-1", "1.5", "0500", "1000000001"])("refuse le montant invalide %s", (amount) => {
    expect(() => goalRequest({ ...form, amount })).toThrow();
  });
  it.each(["2026-02-30", "invalide"])("refuse une date impossible : %s", (startsAt) => {
    expect(() => goalRequest({ ...form, startsAt })).toThrow();
  });
  it("refuse un nombre d'échéances hors contrat", () => {
    expect(() => goalRequest({ ...form, installments: "367" })).toThrow();
  });
});
