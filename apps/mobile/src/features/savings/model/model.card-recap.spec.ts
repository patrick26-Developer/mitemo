import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { recapFactRows, recapGoalLines } from "./model.card-recap";

describe("recapFactRows", () => {
  it("liste le reste, la création et l'échéance d'une carte indépendante, sans frais", () => {
    expect(recapFactRows(makeCard(), null)).toEqual([
      { kind: "remaining", label: "Reste à épargner", value: "10 000 FCFA" },
      { kind: "created", label: "Créée le", value: "1 novembre 2026" },
      { kind: "deadline", label: "Échéance", value: "31 décembre 2026" },
    ]);
  });

  it("termine par la tontine liée quand la carte en a une", () => {
    const rows = recapFactRows(makeCard({ tontineId: "t1" }), "Tontine du Marché");

    expect(rows.at(-1)).toEqual({
      kind: "tontine",
      label: "Tontine liée",
      value: "Tontine du Marché",
    });
  });
});

describe("recapGoalLines", () => {
  it("détaille l'objectif, le montant d'un pointage et la fréquence", () => {
    const card = makeCard({ markerAmount: 5_000n, frequency: { unit: "jour", interval: 2 } });

    expect(recapGoalLines(card)).toEqual([
      { label: "Objectif", value: "30 000 FCFA" },
      { label: "Montant", value: "5 000 FCFA" },
      { label: "Fréquence", value: "tous les 2 jours" },
    ]);
  });
});
