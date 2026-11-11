import { NOISE_TILE_SIZE, noiseDots } from "./model.noise";

describe("noiseDots", () => {
  it("tire toujours les mêmes points pour une même graine", () => {
    expect(noiseDots(7)).toEqual(noiseDots(7));
    expect(noiseDots(7)).not.toEqual(noiseDots(8));
  });

  it("garde chaque point dans la tuile, clair ou sombre, avec une opacité discrète", () => {
    for (const dot of noiseDots(1)) {
      expect(dot.x).toBeGreaterThanOrEqual(0);
      expect(dot.x).toBeLessThan(NOISE_TILE_SIZE);
      expect(dot.y).toBeGreaterThanOrEqual(0);
      expect(dot.y).toBeLessThan(NOISE_TILE_SIZE);
      expect(["#FFFFFF", "#000000"]).toContain(dot.color);
      expect(dot.opacity).toBeGreaterThan(0);
      expect(dot.opacity).toBeLessThanOrEqual(0.12);
    }
  });
});
