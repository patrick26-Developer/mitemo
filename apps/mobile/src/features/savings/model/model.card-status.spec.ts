import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { cardStatus } from "./model.card-status";

describe("cardStatus", () => {
  it("annonce une carte pas encore commencée", () => {
    expect(cardStatus(makeCard({ saved: 0n }))).toEqual({
      label: "Pas commencée",
      detail: "0 sur 6 pointages",
    });
  });

  it("annonce une carte en cours avec les pointages faits", () => {
    expect(cardStatus(makeCard({ saved: 20_000n }))).toEqual({
      label: "En cours",
      detail: "4 sur 6 pointages",
    });
  });

  it("annonce l'objectif atteint dès que la carte est remplie", () => {
    expect(cardStatus(makeCard({ saved: 30_000n })).label).toBe("Objectif atteint");
    expect(cardStatus(makeCard({ saved: 10_000n, state: "COMPLETED" })).label).toBe(
      "Objectif atteint",
    );
  });

  it("annonce une carte archivée, son épargne déjà retirée", () => {
    expect(cardStatus(makeCard({ saved: 30_000n, state: "ARCHIVED" })).label).toBe("Retirée");
  });

  it("accorde au singulier une carte d'un seul pointage", () => {
    expect(cardStatus(makeCard({ saved: 0n, markersTotal: 1 })).detail).toBe("0 sur 1 pointage");
  });
});
