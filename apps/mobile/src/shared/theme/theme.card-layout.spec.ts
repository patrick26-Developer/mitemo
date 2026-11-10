import {
  CARD_BORDER,
  CARD_HEADER_BORDER,
  CARD_PADDING,
  CARD_WIDTH,
  FULL_CARD_WIDTH,
  computeHeaderWidth,
} from "./theme.card-layout";

describe("computeHeaderWidth", () => {
  it("déduit le rembourrage et les bordures de la largeur de la carte", () => {
    expect(computeHeaderWidth(300)).toBe(
      300 - 2 * CARD_PADDING - 2 * CARD_BORDER - 2 * CARD_HEADER_BORDER,
    );
  });

  it("s'adapte à la carte de la home", () => {
    expect(computeHeaderWidth(CARD_WIDTH)).toBe(CARD_WIDTH - 20);
  });

  it("s'adapte à une carte pleine largeur", () => {
    expect(computeHeaderWidth(FULL_CARD_WIDTH)).toBe(FULL_CARD_WIDTH - 20);
  });
});
