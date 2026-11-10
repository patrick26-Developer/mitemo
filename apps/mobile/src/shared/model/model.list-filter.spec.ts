import { LIST_FILTERS, matchesFilter, matchesSearch } from "./model.list-filter";

describe("matchesFilter", () => {
  it("garde les éléments actifs avec le filtre active", () => {
    expect(matchesFilter(false, "active")).toBe(true);
    expect(matchesFilter(true, "active")).toBe(false);
  });

  it("garde les éléments terminés avec le filtre completed", () => {
    expect(matchesFilter(true, "completed")).toBe(true);
    expect(matchesFilter(false, "completed")).toBe(false);
  });
});

describe("matchesSearch", () => {
  it("accepte tout quand la recherche est vide", () => {
    expect(matchesSearch("Tontine du Marché", "  ")).toBe(true);
  });

  it("ignore la casse et les accents", () => {
    expect(matchesSearch("Tontine du Marché Tolal", "marche")).toBe(true);
    expect(matchesSearch("Loyer de Janvier", "LOYER")).toBe(true);
  });

  it("rejette un libellé qui ne contient pas la recherche", () => {
    expect(matchesSearch("Assurance santé", "loyer")).toBe(false);
  });
});

describe("LIST_FILTERS", () => {
  it("propose les deux états d'une liste", () => {
    expect(LIST_FILTERS).toEqual(["active", "completed"]);
  });
});
