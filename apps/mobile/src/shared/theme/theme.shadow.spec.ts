import { SHADOWS, boxShadow } from "./theme.shadow";

describe("boxShadow", () => {
  it("écrit une ombre CSS, rendue pareil sur iOS et Android", () => {
    expect(boxShadow({ y: -8, radius: 24, opacity: 0.16 })).toBe(
      "0px -8px 48px rgba(0, 0, 0, 0.16)",
    );
  });
});

describe("SHADOWS", () => {
  it("ne garde aucune ombre propre à une plateforme", () => {
    for (const style of Object.values(SHADOWS)) {
      expect(style).not.toHaveProperty("elevation");
      expect(style).not.toHaveProperty("shadowColor");
      expect(typeof style.boxShadow).toBe("string");
    }
  });
});
