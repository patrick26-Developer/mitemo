import { groupSearchResults, searchEntries } from "./search-content";

describe("searchEntries", () => {
  it("ne renvoie rien pour une recherche vide", () => {
    expect(searchEntries("   ")).toEqual([]);
  });

  it("retrouve une carte par son titre", () => {
    const results = searchEntries("loyer");

    expect(results.map((entry) => entry.title)).toContain("Loyer de Janvier");
  });

  it("ignore les accents et la casse", () => {
    const results = searchEntries("MARCHE");

    expect(results.map((entry) => entry.title)).toContain("Tontine du Marché Tolal");
  });

  it("retrouve un réglage du profil", () => {
    const results = searchEntries("securite");

    expect(results.map((entry) => entry.title)).toContain("Sécurité");
  });
});

describe("groupSearchResults", () => {
  it("regroupe les résultats par type sans groupe vide", () => {
    const groups = groupSearchResults(searchEntries("tontine"));

    expect(groups.map((group) => group.title)).toEqual(["Tontines", "Profil", "Pages"]);
  });

  it("conserve l'ordre des résultats dans chaque groupe", () => {
    const groups = groupSearchResults(searchEntries("tontine"));
    const tontines = groups[0]?.results ?? [];

    expect(tontines).toHaveLength(3);
    expect(tontines[0]?.title).toBe("Tontine du Marché Tolal");
  });
});
