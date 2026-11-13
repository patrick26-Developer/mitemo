import { formatAmount } from "../../../shared/format/format.amount";
import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import {
  NO_TONTINE,
  linkedTontineName,
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
