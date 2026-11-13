import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { cardEditForm, cardLevelText, parseCardEdit } from "./model.card-options";

describe("cardLevelText", () => {
  it("explique le niveau et la couleur de la carte par son pointage", () => {
    expect(cardLevelText(makeCard({ markerAmount: 6_000n }))).toEqual({
      title: "Niveau 3 sur 5 · carte sable",
      body: "Votre carte est sable parce que chaque pointage est de 6 000 à 19 999 FCFA. Plus vos pointages sont grands, plus la carte monte de niveau et change de couleur.",
    });
  });

  it("annonce le dernier niveau sans plafond", () => {
    expect(cardLevelText(makeCard({ markerAmount: 75_000n })).body).toMatch(
      /chaque pointage est de 50 000 FCFA ou plus\. Vous êtes au plus haut niveau/,
    );
  });
});

describe("parseCardEdit", () => {
  const form = cardEditForm(makeCard({ name: "Loyer", goal: 30_000n, markerAmount: 5_000n }));

  it("préremplit le formulaire avec la carte", () => {
    expect(form).toEqual({ name: "Loyer", goal: "30000", markerAmount: "5000" });
  });

  it("valide une modification complète", () => {
    expect(parseCardEdit({ ...form, name: "  Rentrée  ", goal: "120000" })).toEqual({
      ok: true,
      value: { name: "Rentrée", goal: 120_000n, markerAmount: 5_000n },
    });
  });

  it("refuse un nom vide, un montant absent ou un pointage plus grand que l'objectif", () => {
    expect(parseCardEdit({ ...form, name: " " })).toEqual({
      ok: false,
      message: "Donnez un nom à la carte.",
    });
    expect(parseCardEdit({ ...form, goal: "" })).toEqual({
      ok: false,
      message: "Indiquez l'objectif et le pointage.",
    });
    expect(parseCardEdit({ ...form, markerAmount: "40000" })).toEqual({
      ok: false,
      message: "Le pointage ne peut pas dépasser l'objectif.",
    });
  });
});
