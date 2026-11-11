import { pointedCount } from "./model.card-history-count";

describe("pointedCount", () => {
  it("compte les pointages déjà faits sur le total", () => {
    expect(pointedCount(5, 10)).toBe("5 sur 10 déjà pointés");
  });

  it("accorde au singulier un seul pointage fait", () => {
    expect(pointedCount(1, 10)).toBe("1 sur 10 déjà pointé");
    expect(pointedCount(0, 10)).toBe("0 sur 10 déjà pointé");
  });
});
