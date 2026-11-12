import type { TontineFrequency } from "../member/model.portfolio";
import { markersForPlan } from "./model.markers";

/** Date de création du plan, fixée pour ne pas dépendre de l'horloge. */
const START = "2026-11-11";

/**
 * Construit un plan de pointage de test.
 * @param frequency Rythme du pointage.
 * @param deadline Date limite du plan.
 * @returns Le plan prêt à être évalué.
 */
function plan(frequency: TontineFrequency, deadline: string) {
  return { frequency, start: START, deadline };
}

describe("markersForPlan", () => {
  it("compte un marqueur par jour entamé", () => {
    expect(markersForPlan(plan({ unit: "jour", interval: 1 }, "2026-11-13"))).toBe(2);
  });

  it("compte une semaine entamée comme un marqueur", () => {
    expect(markersForPlan(plan({ unit: "semaine", interval: 1 }, "2026-11-24"))).toBe(2);
  });

  it("divise les semaines par l'intervalle choisi", () => {
    expect(markersForPlan(plan({ unit: "semaine", interval: 2 }, "2026-11-24"))).toBe(1);
    expect(markersForPlan(plan({ unit: "semaine", interval: 2 }, "2026-12-01"))).toBe(2);
  });

  it("compte un mois entamé comme un marqueur", () => {
    expect(markersForPlan(plan({ unit: "mois", interval: 1 }, "2026-12-11"))).toBe(1);
    expect(markersForPlan(plan({ unit: "mois", interval: 1 }, "2026-12-12"))).toBe(2);
  });

  it("divise les mois par l'intervalle choisi", () => {
    expect(markersForPlan(plan({ unit: "mois", interval: 3 }, "2026-12-12"))).toBe(1);
    expect(markersForPlan(plan({ unit: "mois", interval: 3 }, "2027-05-12"))).toBe(3);
  });

  it("compte au moins un marqueur", () => {
    expect(markersForPlan(plan({ unit: "mois", interval: 1 }, START))).toBe(1);
    expect(markersForPlan(plan({ unit: "jour", interval: 1 }, "2026-11-01"))).toBe(1);
  });
});
