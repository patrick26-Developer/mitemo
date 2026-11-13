import { LOGO_SHAPE_ENTER_MS, logoShapeDelay, WORDMARK_DELAY_MS } from "./model.splash-motion";

describe("logoShapeDelay", () => {
  it("dessine les trois formes du logo l'une après l'autre", () => {
    const delays = [0, 1, 2].map(logoShapeDelay);

    expect(delays[0]).toBe(0);
    expect(delays[1]).toBeGreaterThan(delays[0] ?? 0);
    expect(delays[2]).toBeGreaterThan(delays[1] ?? 0);
  });
});

describe("WORDMARK_DELAY_MS", () => {
  it("fait apparaître le nom en bas une fois le logo dessiné", () => {
    expect(WORDMARK_DELAY_MS).toBeGreaterThanOrEqual(logoShapeDelay(2) + LOGO_SHAPE_ENTER_MS / 2);
  });

  it("termine le lancement en moins d'une seconde et demie", () => {
    expect(WORDMARK_DELAY_MS + LOGO_SHAPE_ENTER_MS).toBeLessThan(1_500);
  });
});
