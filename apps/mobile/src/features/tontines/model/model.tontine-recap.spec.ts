import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import {
  tontineFactRows,
  tontineGoalLines,
  tontineProgress,
  tontineStatus,
} from "./model.tontine-recap";

describe("tontineStatus", () => {
  it("annonce une tontine en préparation avec les tours déjà pris", () => {
    expect(tontineStatus(makeTontine({ state: "PENDING", totalRounds: 5 }))).toEqual({
      label: "En préparation",
      detail: "3 sur 5 tours pris",
    });
  });

  it("annonce le tour en cours d'une tontine active", () => {
    expect(tontineStatus(makeTontine({ round: 2 }))).toEqual({
      label: "En cours",
      detail: "Tour 2 sur 3",
    });
  });

  it("annonce une tontine terminée", () => {
    expect(tontineStatus(makeTontine({ state: "COMPLETED", round: 3 })).label).toBe("Terminée");
  });
});

describe("tontineProgress", () => {
  it("suit les membres réunis avant le départ, puis les tours", () => {
    expect(tontineProgress(makeTontine({ state: "PENDING", totalRounds: 6 }))).toBe(0.5);
    expect(tontineProgress(makeTontine({ round: 1, totalRounds: 4 }))).toBe(0.25);
    expect(tontineProgress(makeTontine({ state: "COMPLETED", round: 2 }))).toBe(1);
  });
});

describe("tontineGoalLines", () => {
  it("détaille la cotisation, la fréquence et les membres", () => {
    expect(tontineGoalLines(makeTontine({ contribution: 10_000n }))).toEqual([
      { label: "Cotisation", value: "10 000 FCFA" },
      { label: "Fréquence", value: "chaque semaine" },
      { label: "Membres", value: "3" },
    ]);
  });
});

describe("tontineFactRows", () => {
  it("liste la cagnotte, le bénéficiaire, les cotisations reçues et les tours restants", () => {
    const tontine = makeTontine({
      members: [
        makeMember(SELF_MEMBER_ID, "ADMIN", true),
        makeMember("m2", "MEMBRE"),
        makeMember("m3", "MEMBRE"),
      ],
    });

    expect(tontineFactRows(tontine)).toEqual([
      { kind: "pot", label: "Restourne du tour", value: "10 000 FCFA" },
      { kind: "beneficiary", label: "Bénéficiaire", value: "Membre m2" },
      { kind: "paid", label: "Cotisations reçues", value: "1 sur 3" },
      { kind: "remaining", label: "Tours restants", value: "2" },
    ]);
  });

  it("ne donne ni bénéficiaire ni cotisations avant le départ", () => {
    const kinds = tontineFactRows(makeTontine({ state: "PENDING" })).map((row) => row.kind);

    expect(kinds).toEqual(["pot", "remaining"]);
  });
});
