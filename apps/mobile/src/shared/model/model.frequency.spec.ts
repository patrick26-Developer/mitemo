import {
  FREQUENCY_GROUPS,
  FREQUENCY_OPTIONS,
  frequencyById,
  frequencyLabel,
} from "./model.frequency";

describe("model.frequency", () => {
  it("propose chaque unité avec tous ses intervalles", () => {
    expect(FREQUENCY_GROUPS.map((group) => group.title)).toEqual([
      "Au jour",
      "À la semaine",
      "Au mois",
    ]);
    expect(FREQUENCY_OPTIONS).toHaveLength(23);
  });

  it("libelle les fréquences comme on en parle dans la sous-région", () => {
    expect(frequencyLabel("jour-1")).toBe("Chaque jour");
    expect(frequencyLabel("jour-2")).toBe("Tous les 2 jours");
    expect(frequencyLabel("semaine-2")).toBe("Toutes les 2 semaines");
    expect(frequencyLabel("mois-1")).toBe("Chaque mois");
    expect(frequencyLabel("mois-3")).toBe("Tous les 3 mois");
  });

  it("donne des identifiants uniques", () => {
    const ids = FREQUENCY_OPTIONS.map((option) => option.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("retrouve une fréquence par son identifiant", () => {
    expect(frequencyById("semaine-2")).toEqual({ unit: "semaine", interval: 2 });
    expect(frequencyById("annee-1")).toBeUndefined();
  });
});
