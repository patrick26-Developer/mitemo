import { searchEmptyState } from "./model.list-empty-state";

describe("searchEmptyState", () => {
  it("ne propose rien quand la recherche est vide", () => {
    expect(searchEmptyState("", "tontine")).toBeNull();
    expect(searchEmptyState("   ", "tontine")).toBeNull();
  });

  it("nomme l'élément recherché et la saisie", () => {
    expect(searchEmptyState("  amis ", "tontine")).toEqual({
      title: "Aucun résultat",
      message: "Aucune tontine ne correspond à « amis ».",
    });
  });

  it("accorde le nom de l'élément au féminin", () => {
    expect(searchEmptyState("santé", "carte")).toEqual({
      title: "Aucun résultat",
      message: "Aucune carte ne correspond à « santé ».",
    });
  });
});
