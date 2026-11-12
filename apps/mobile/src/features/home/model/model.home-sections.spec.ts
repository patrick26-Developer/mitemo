import { makeCard, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { homeSections } from "./model.home-sections";

describe("homeSections", () => {
  it("ne garde que les tontines lancées et les cartes non archivées", () => {
    const sections = homeSections(
      [makeTontine({ id: "a" }), makeTontine({ id: "b", state: "PENDING" })],
      [makeCard({ id: "c" }), makeCard({ id: "d", state: "ARCHIVED" })],
    );

    expect(sections.tontines.map((item) => item.id)).toEqual(["a"]);
    expect(sections.cards.map((item) => item.id)).toEqual(["c"]);
    expect(sections.empty).toBe(false);
  });

  it("signale un accueil vide quand il n'y a ni tontine ni carte active", () => {
    const sections = homeSections(
      [makeTontine({ state: "COMPLETED" })],
      [makeCard({ state: "ARCHIVED" })],
    );

    expect(sections).toEqual({ tontines: [], cards: [], empty: true });
  });
});
