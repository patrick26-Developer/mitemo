import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import {
  NO_TONTINE,
  linkedTontineName,
  tontineIdOf,
  tontineLinkGroups,
} from "./model.tontine-link";

const TONTINES = [makeTontine({ id: "t1", name: "Les Amis" })];

describe("tontineLinkGroups", () => {
  it("propose « Aucune tontine », puis les tontines du membre", () => {
    expect(tontineLinkGroups(TONTINES)).toEqual([
      { title: "Carte indépendante", options: [{ value: NO_TONTINE, label: "Aucune tontine" }] },
      { title: "Vos tontines", options: [{ value: "t1", label: "Les Amis" }] },
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
