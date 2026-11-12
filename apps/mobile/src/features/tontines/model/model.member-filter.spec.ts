import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { memberFilterOptions, memberRows, membersEmptyState } from "./model.member-filter";

/** Tontine en cours : deux membres à jour, un en attente. */
const ACTIVE = makeTontine({
  members: [
    { ...makeMember("self", "ADMIN", true), name: "Précieuse Mavoungou" },
    { ...makeMember("m2", "MEMBRE", true), name: "Mama Nadège" },
    { ...makeMember("m3", "MEMBRE"), name: "Clarisse Nzaba" },
  ],
});

/** Tontine en préparation : un inscrit et deux invitations envoyées. */
const PENDING = makeTontine({
  state: "PENDING",
  totalRounds: 5,
  members: [makeMember("self", "ADMIN")],
  invitations: [
    { id: "i1", name: "Aimée Mbemba", phone: "+242065706622" },
    { id: "i2", name: "Serge Makosso", phone: "+242055123456" },
  ],
});

/**
 * Noms des lignes retenues.
 * @param rows Lignes filtrées.
 * @returns Le nom de chaque membre ou invité.
 */
function names(rows: ReturnType<typeof memberRows>): readonly string[] {
  return rows.map((row) => (row.kind === "member" ? row.member.name : row.invitation.name));
}

describe("memberFilterOptions", () => {
  it("propose À jour et En attente pendant le cycle, avec leur compte", () => {
    expect(memberFilterOptions(ACTIVE).map((option) => option.label)).toEqual([
      "Tous · 3",
      "À jour · 2",
      "En attente · 1",
    ]);
  });

  it("propose Inscrits et Invités avant le départ", () => {
    expect(memberFilterOptions(PENDING).map((option) => option.label)).toEqual([
      "Tous · 3",
      "Inscrits · 1",
      "Invités · 2",
    ]);
  });
});

describe("memberRows", () => {
  it("garde les membres à jour", () => {
    expect(names(memberRows(ACTIVE, { filter: "paid", query: "" }))).toEqual([
      "Précieuse Mavoungou",
      "Mama Nadège",
    ]);
  });

  it("garde les membres en attente de cotisation", () => {
    expect(names(memberRows(ACTIVE, { filter: "due", query: "" }))).toEqual(["Clarisse Nzaba"]);
  });

  it("cherche par nom, sans tenir compte des accents ni de la casse", () => {
    expect(names(memberRows(ACTIVE, { filter: "all", query: "nadege" }))).toEqual(["Mama Nadège"]);
  });

  it("liste les inscrits puis les invités avant le départ", () => {
    expect(names(memberRows(PENDING, { filter: "all", query: "" }))).toEqual([
      "Membre self",
      "Aimée Mbemba",
      "Serge Makosso",
    ]);
    expect(names(memberRows(PENDING, { filter: "invited", query: "serge" }))).toEqual([
      "Serge Makosso",
    ]);
  });
});

describe("membersEmptyState", () => {
  it("rappelle la recherche saisie", () => {
    expect(membersEmptyState("zzz")).toEqual({
      title: "Aucun membre trouvé",
      message: "Aucun membre ne correspond à « zzz » avec ce filtre.",
    });
  });

  it("explique un filtre vide sans recherche", () => {
    expect(membersEmptyState(" ").message).toBe("Aucun membre ne correspond à ce filtre.");
  });
});
