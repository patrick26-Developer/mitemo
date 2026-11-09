import { LIST_FILTERS, matchesFilter } from "./list-filter";

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

describe("LIST_FILTERS", () => {
  it("propose les deux états d'une liste", () => {
    expect(LIST_FILTERS).toEqual(["active", "completed"]);
  });
});
