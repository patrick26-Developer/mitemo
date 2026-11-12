import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { cardContributions, isPastDeadline } from "./model.card-contributions";

/** Carte de 4 pointages hebdomadaires de 5 000 FCFA, du 2 au 30 novembre 2026. */
const CARD = makeCard({
  markersTotal: 4,
  markerAmount: 5_000n,
  frequency: { unit: "semaine", interval: 1 },
  startDate: "2026-11-02",
  deadline: "2026-11-30",
  entries: [
    { at: "2026-11-03T08:00:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
    { at: "2026-11-17T08:00:00.000Z", amount: 2_000n, method: "AIRTEL_MONEY" },
    { at: "2026-11-24T08:00:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
    { at: "2026-11-25T08:00:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
  ],
});

describe("cardContributions", () => {
  it("donne une case par pointage prévu, d'autant plus intense que la période est réglée", () => {
    expect(cardContributions(CARD).cells).toEqual([
      { start: "2026-11-02", level: 2, amount: 5_000n },
      { start: "2026-11-09", level: 0, amount: 0n },
      { start: "2026-11-16", level: 1, amount: 2_000n },
      { start: "2026-11-23", level: 3, amount: 10_000n },
    ]);
  });

  it("compte les périodes réglées en entier", () => {
    expect(cardContributions(CARD)).toMatchObject({ regular: 2, total: 4 });
  });

  it("découpe les périodes mensuelles au mois civil", () => {
    const monthly = makeCard({
      markersTotal: 3,
      frequency: { unit: "mois", interval: 1 },
      startDate: "2026-01-31",
      deadline: "2026-04-30",
      entries: [],
    });

    expect(cardContributions(monthly).cells.map((cell) => cell.start)).toEqual([
      "2026-01-31",
      "2026-02-28",
      "2026-03-31",
    ]);
  });
});

describe("isPastDeadline", () => {
  it("n'est vrai qu'une fois le jour de l'échéance passé", () => {
    expect(isPastDeadline(CARD, "2026-11-30")).toBe(false);
    expect(isPastDeadline(CARD, "2026-12-01")).toBe(true);
  });
});
