import { canEditCardAmounts } from "./model.card-edit";
import { cardLevel } from "./model.card-tint";
import { ForbiddenOperationError } from "./model.portfolio-error";
import { makeCard, makePortfolio, TEST_PORTFOLIO } from "../testing/fixtures.portfolio";

/** Carte neuve, sans pointage. */
const FRESH = makeCard({ id: "c1", entries: [], saved: 0n, markerAmount: 5_000n, goal: 30_000n });

describe("canEditCardAmounts", () => {
  it("permet de changer les montants avant le premier pointage", () => {
    expect(canEditCardAmounts(FRESH)).toBe(true);
  });

  it("fige les montants dès le premier pointage", () => {
    expect(canEditCardAmounts({ ...FRESH, saved: 5_000n })).toBe(false);
  });
});

describe("updateCard", () => {
  it("change le nom, l'objectif et le pointage, et recalcule couleur et frais", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, cards: [FRESH] });

    actions.updateCard("c1", { name: "Rentrée scolaire", goal: 120_000n, markerAmount: 20_000n });

    expect(state().cards[0]).toEqual(
      expect.objectContaining({
        name: "Rentrée scolaire",
        goal: 120_000n,
        markerAmount: 20_000n,
        tint: "#F2C9E4",
        fee: 12_000n,
      }),
    );
  });

  it("renomme une carte déjà pointée", () => {
    const pointed = { ...FRESH, saved: 5_000n };
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, cards: [pointed] });

    actions.updateCard("c1", { name: "Loyer", goal: 30_000n, markerAmount: 5_000n });

    expect(state().cards[0]?.name).toBe("Loyer");
  });

  it("refuse de changer les montants d'une carte déjà pointée", () => {
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, cards: [{ ...FRESH, saved: 5_000n }] });

    expect(() =>
      actions.updateCard("c1", { name: "Loyer", goal: 60_000n, markerAmount: 5_000n }),
    ).toThrow(ForbiddenOperationError);
  });
});

describe("cardLevel", () => {
  it("place la carte dans l'une des cinq tranches de pointage", () => {
    expect(cardLevel(500n)).toEqual({ level: 1, total: 5, from: 0n, to: 999n });
    expect(cardLevel(6_000n)).toEqual({ level: 3, total: 5, from: 6_000n, to: 19_999n });
    expect(cardLevel(80_000n)).toEqual({ level: 5, total: 5, from: 50_000n, to: null });
  });
});
