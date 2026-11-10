import { savingsProgress } from "./model.savings-progress";

describe("savingsProgress", () => {
  it("calcule la part épargnée", () => {
    expect(savingsProgress(20_000n, 30_000n)).toBeCloseTo(2 / 3, 3);
  });

  it("borne la part à 1 quand l'objectif est atteint", () => {
    expect(savingsProgress(30_000n, 30_000n)).toBe(1);
  });

  it("borne la part à 1 quand l'objectif est dépassé", () => {
    expect(savingsProgress(40_000n, 30_000n)).toBe(1);
  });

  it("renvoie 0 quand l'objectif est nul", () => {
    expect(savingsProgress(20_000n, 0n)).toBe(0);
  });

  it("renvoie 0 quand l'épargne est négative", () => {
    expect(savingsProgress(-1_000n, 30_000n)).toBe(0);
  });
});
