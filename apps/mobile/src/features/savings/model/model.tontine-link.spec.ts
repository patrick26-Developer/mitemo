import { formatAmount } from "../../../shared/format/format.amount";
import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import {
  NO_TONTINE,
  linkTontine,
  linkedTontineName,
  tontineEndDate,
  tontineIdOf,
  tontineLinkGroups,
} from "./model.tontine-link";

const TONTINES = [
  makeTontine({ id: "t1", name: "Les Amis", headerColors: ["#2CCA86", "#62F79D"] }),
];

describe("tontineLinkGroups", () => {
  it("propose « Aucune tontine », puis les tontines du membre", () => {
    const [none, linked] = tontineLinkGroups(TONTINES);
    const members = TONTINES[0]?.members.length ?? 0;

    expect(none).toEqual({
      title: "Carte indépendante",
      options: [
        { value: NO_TONTINE, label: "Aucune tontine", description: "La carte reste indépendante." },
      ],
    });
    expect(linked?.options).toEqual([
      {
        value: "t1",
        label: "Les Amis",
        description: `${members} membres · ${formatAmount(TONTINES[0]?.contribution ?? 0n)} FCFA par tour`,
        accent: "#2CCA86",
      },
    ]);
  });

  it("ne propose que « Aucune tontine » à un membre sans tontine", () => {
    expect(tontineLinkGroups([])).toHaveLength(1);
  });
});

describe("tontineIdOf", () => {
  it("rattache la tontine choisie, ou aucune", () => {
    expect(tontineIdOf("t1")).toBe("t1");
    expect(tontineIdOf(NO_TONTINE)).toBeNull();
  });
});

describe("linkedTontineName", () => {
  it("retrouve le nom de la tontine rattachée", () => {
    expect(linkedTontineName(TONTINES, "t1")).toBe("Les Amis");
    expect(linkedTontineName(TONTINES, null)).toBeNull();
  });
});

describe("tontineEndDate", () => {
  it("place l'échéance à la fin des tours restants, au rythme de la tontine", () => {
    const tontine = makeTontine({
      round: 2,
      totalRounds: 3,
      frequency: { unit: "mois", interval: 1 },
    });

    expect(tontineEndDate(tontine, new Date("2026-11-13T09:00:00.000Z"))).toBe("2027-01-13");
  });

  it("compte tous les tours d'une tontine pas encore lancée", () => {
    const pending = makeTontine({
      state: "PENDING",
      round: 1,
      totalRounds: 4,
      frequency: { unit: "semaine", interval: 1 },
    });

    expect(tontineEndDate(pending, new Date("2026-11-13T09:00:00.000Z"))).toBe("2026-12-11");
  });
});

describe("linkTontine", () => {
  const NOW = new Date("2026-11-13T09:00:00.000Z");
  const TONTINES = [makeTontine({ id: "t1", round: 3, totalRounds: 3 })];

  it("fixe l'échéance sur la fin de la tontine choisie", () => {
    expect(linkTontine(TONTINES, "t1", NOW)).toEqual({ tontineId: "t1", deadline: "2026-11-20" });
  });

  it("rend l'échéance au membre quand la carte redevient indépendante", () => {
    expect(linkTontine(TONTINES, NO_TONTINE, NOW)).toEqual({ tontineId: null, deadline: "" });
  });
});
