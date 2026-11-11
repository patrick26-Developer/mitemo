import { INITIAL_CARDS } from "../../../shared/demo/demo.savings";
import { INITIAL_TONTINES } from "../../../shared/demo/demo.tontines";
import { groupSearchResults, isSearchPending, searchEntries } from "./model.search-content";

/**
 * Recherche dans le portefeuille de démonstration.
 * @param query Texte recherché.
 * @returns Les résultats correspondants.
 */
function search(query: string) {
  return searchEntries(query, INITIAL_TONTINES, INITIAL_CARDS);
}

describe("searchEntries", () => {
  it("ne renvoie rien pour une recherche vide", () => {
    expect(search("   ")).toEqual([]);
  });

  it("retrouve une carte par son titre", () => {
    const results = search("loyer");

    expect(results.map((entry) => entry.title)).toContain("Loyer de Janvier");
  });

  it("ignore les accents et la casse", () => {
    const results = search("MARCHE");

    expect(results.map((entry) => entry.title)).toContain("Tontine du Marché Tolal");
  });

  it("retrouve un réglage du profil", () => {
    const results = search("securite");

    expect(results.map((entry) => entry.title)).toContain("Sécurité");
  });

  it("suit le portefeuille réel plutôt que des données figées", () => {
    const results = searchEntries("assurance", [], INITIAL_CARDS.slice(1, 2));

    expect(results.map((entry) => entry.title)).toEqual(["Assurance santé"]);
  });
});

describe("isSearchPending", () => {
  it("attend la saisie stabilisée", () => {
    expect(isSearchPending("loy", "loyer")).toBe(true);
  });

  it("ne charge rien quand la saisie est vide ou stabilisée", () => {
    expect(isSearchPending("", "")).toBe(false);
    expect(isSearchPending("loyer", "loyer")).toBe(false);
  });
});

describe("groupSearchResults", () => {
  it("regroupe les résultats par type sans groupe vide", () => {
    const groups = groupSearchResults(search("tontine"));

    expect(groups.map((group) => group.title)).toEqual(["Tontines", "Profil", "Pages"]);
  });

  it("conserve l'ordre des résultats dans chaque groupe", () => {
    const groups = groupSearchResults(search("tontine"));
    const tontines = groups[0]?.results ?? [];

    expect(tontines).toHaveLength(3);
    expect(tontines[0]?.title).toBe("Tontine du Marché Tolal");
  });
});
