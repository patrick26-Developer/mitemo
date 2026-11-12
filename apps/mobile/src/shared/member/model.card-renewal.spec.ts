import { makeCard } from "../testing/fixtures.portfolio";
import { renewedCardInput } from "./model.card-renewal";

describe("renewedCardInput", () => {
  it("reprend le plan de la carte à partir d'aujourd'hui, sur la même durée", () => {
    const card = makeCard({ tontineId: "t1", startDate: "2026-11-01", deadline: "2026-12-31" });

    expect(renewedCardInput(card, "2026-12-01")).toEqual({
      name: card.name,
      goal: card.goal,
      markerAmount: card.markerAmount,
      markersTotal: card.markersTotal,
      frequency: card.frequency,
      startDate: "2026-12-01",
      deadline: "2027-01-30",
      tontineId: "t1",
      description: card.description,
    });
  });
});
