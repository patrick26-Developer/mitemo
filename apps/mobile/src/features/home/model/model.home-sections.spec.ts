import { makeCard, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { HOME_PREVIEW_LIMIT, homeSections } from "./model.home-sections";

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

    expect(sections).toEqual({
      tontines: [],
      tontineCount: 0,
      cards: [],
      cardCount: 0,
      empty: true,
    });
  });

  it("ne garde que les premières en aperçu, mais compte toutes les actives", () => {
    const tontines = Array.from({ length: 7 }, (_, index) => makeTontine({ id: `t${index}` }));
    const sections = homeSections(tontines, []);

    expect(sections.tontines).toHaveLength(HOME_PREVIEW_LIMIT);
    expect(sections.tontineCount).toBe(7);
  });
});
