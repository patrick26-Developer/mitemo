import { PRIVACY_SECTIONS, TERMS_SECTIONS } from "./model.profile-documents";

/**
 * Titres d'un document légal.
 * @param sections Sections du document.
 * @returns Les titres, dans l'ordre.
 */
function titles(sections: readonly { readonly title: string }[]): readonly string[] {
  return sections.map((section) => section.title);
}

describe("PRIVACY_SECTIONS", () => {
  it("couvre les données, leur usage, leur partage, leur sécurité et les droits du membre", () => {
    expect(titles(PRIVACY_SECTIONS)).toEqual(
      expect.arrayContaining([
        "Données collectées",
        "Finalités",
        "Partage des données",
        "Hébergement et transferts",
        "Sécurité",
        "Conservation",
        "Vos droits",
        "Nous contacter",
      ]),
    );
  });

  it("cite la loi congolaise sur la protection des données personnelles", () => {
    expect(PRIVACY_SECTIONS.map((section) => section.body).join(" ")).toMatch(/loi n° 29-2019/);
  });
});

describe("TERMS_SECTIONS", () => {
  it("couvre le service, le compte, les tontines, les cartes, les paiements et la résiliation", () => {
    expect(titles(TERMS_SECTIONS)).toEqual(
      expect.arrayContaining([
        "Objet du service",
        "Création du compte",
        "Tontines",
        "Cartes de pointage",
        "Paiements et retraits",
        "Responsabilités",
        "Résiliation",
        "Droit applicable",
      ]),
    );
  });

  it("ne rappelle jamais les frais au membre", () => {
    const text = [...TERMS_SECTIONS, ...PRIVACY_SECTIONS].map((section) => section.body).join(" ");

    expect(text).not.toMatch(/frais/i);
  });

  it("donne à chaque section un texte développé", () => {
    for (const section of [...TERMS_SECTIONS, ...PRIVACY_SECTIONS]) {
      expect(section.body.length).toBeGreaterThan(120);
    }
  });
});
