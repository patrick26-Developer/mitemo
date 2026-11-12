import { cardHistory } from "./model.card-history";
import type { SavingsCard } from "./model.portfolio";

/**
 * Construit une carte de test.
 * @param over Valeurs à remplacer.
 * @returns La carte complète.
 */
function card(over: Partial<SavingsCard> = {}): SavingsCard {
  return {
    id: "c1",
    name: "Carte de test",
    goal: 30_000n,
    markerAmount: 5_000n,
    markersTotal: 6,
    frequency: { unit: "semaine", interval: 1 },
    startDate: "2026-11-01",
    saved: 20_000n,
    deadline: "2026-12-31",
    tint: "#CFD8FF",
    state: "ACTIVE",
    description: "Une carte de test.",
    tontineId: null,
    fee: 3_000n,
    entries: [],
    ...over,
  };
}

describe("cardHistory", () => {
  it("liste tous les pointages : faits avec leur date, leur montant et leur moyen de paiement, puis à venir", () => {
    const history = cardHistory(
      card({
        markersTotal: 3,
        entries: [
          { at: "2026-11-02T09:15:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
          { at: "2026-11-09T18:40:00.000Z", amount: 7_000n, method: "AIRTEL_MONEY" },
        ],
      }),
    );

    expect(history).toEqual([
      {
        position: 1,
        done: true,
        at: "2026-11-02T09:15:00.000Z",
        amount: 5_000n,
        method: "MTN_MOMO",
      },
      {
        position: 2,
        done: true,
        at: "2026-11-09T18:40:00.000Z",
        amount: 7_000n,
        method: "AIRTEL_MONEY",
      },
      { position: 3, done: false, at: null, amount: 5_000n, method: null },
    ]);
  });

  it("garde les pointages en trop quand la carte a été dépassée", () => {
    const history = cardHistory(
      card({
        markersTotal: 1,
        entries: [
          { at: "2026-11-02T09:15:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
          { at: "2026-11-03T09:15:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
        ],
      }),
    );

    expect(history).toHaveLength(2);
  });
});
