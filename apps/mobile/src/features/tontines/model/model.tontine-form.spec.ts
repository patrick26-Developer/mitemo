import {
  INITIAL_TONTINE_FORM,
  TONTINE_CADENCE_GROUPS,
  TONTINE_FORM_STEPS,
  parseTontineForm,
  tontineInvalidFields,
  tontineRecap,
  tontineStepError,
} from "./model.tontine-form";
import type { TontineFormState } from "./model.tontine-form";

/** Formulaire complet valide. */
const VALID_FORM: TontineFormState = {
  ...INITIAL_TONTINE_FORM,
  name: "Tontine du Quartier",
  contribution: "5000",
  cadence: "semaine-1",
  participants: 6,
};

describe("parseTontineForm", () => {
  it("accepte une saisie complète et construit la tontine", () => {
    const result = parseTontineForm(VALID_FORM);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({
      name: "Tontine du Quartier",
      contribution: 5_000n,
      frequency: { unit: "semaine", interval: 1 },
      participantCount: 6,
    });
  });

  it("accepte un intervalle de plusieurs semaines", () => {
    const result = parseTontineForm({ ...VALID_FORM, cadence: "semaine-2" });

    expect(result.ok && result.value.frequency).toEqual({ unit: "semaine", interval: 2 });
    expect(result.ok && result.value.description).toContain("toutes les 2 semaines");
  });

  it("refuse un nom vide", () => {
    expect(parseTontineForm({ ...VALID_FORM, name: "  " })).toEqual({
      ok: false,
      message: "Donnez un nom à la tontine.",
    });
  });

  it("refuse un nom trop court", () => {
    expect(parseTontineForm({ ...VALID_FORM, name: "ab" })).toEqual({
      ok: false,
      message: "Le nom doit contenir au moins 3 caractères.",
    });
  });

  it("refuse un nom trop long", () => {
    expect(parseTontineForm({ ...VALID_FORM, name: "a".repeat(61) })).toEqual({
      ok: false,
      message: "Le nom ne peut pas dépasser 30 caractères.",
    });
  });

  it("nettoie les espaces autour du nom", () => {
    const result = parseTontineForm({ ...VALID_FORM, name: "  Tontine du Marché  " });

    expect(result.ok && result.value.name).toBe("Tontine du Marché");
  });

  it("refuse une cotisation invalide", () => {
    expect(parseTontineForm({ ...VALID_FORM, contribution: "0" })).toEqual({
      ok: false,
      message: "Saisissez une cotisation valide en FCFA.",
    });
  });

  it("refuse une fréquence hors de la liste", () => {
    expect(parseTontineForm({ ...VALID_FORM, cadence: "semaine-9" })).toEqual({
      ok: false,
      message: "Choisissez une fréquence dans la liste.",
    });
  });

  it("refuse moins de deux participants", () => {
    expect(parseTontineForm({ ...VALID_FORM, participants: 1 })).toEqual({
      ok: false,
      message: "Indiquez entre 2 et 50 participants.",
    });
  });

  it("refuse plus de cinquante participants", () => {
    expect(parseTontineForm({ ...VALID_FORM, participants: 51 })).toEqual({
      ok: false,
      message: "Indiquez entre 2 et 50 participants.",
    });
  });
});

describe("tontineRecap", () => {
  it("résume la cagnotte, les tours et la fréquence", () => {
    expect(tontineRecap({ ...VALID_FORM, cadence: "semaine-2" })).toEqual({
      contribution: 5_000n,
      participants: 6,
      pot: 25_000n,
      frequency: { unit: "semaine", interval: 2 },
      rounds: 6,
      cycleTotal: 30_000n,
    });
  });

  it("n'affiche pas de cagnotte tant que la saisie est incomplète", () => {
    expect(tontineRecap({ ...VALID_FORM, contribution: "" }).pot).toBeNull();
    expect(tontineRecap({ ...VALID_FORM, participants: 1 }).pot).toBeNull();
  });

  it("ignore une fréquence hors de la liste", () => {
    expect(tontineRecap({ ...VALID_FORM, cadence: "semaine-9" }).frequency).toBeNull();
  });
});

describe("TONTINE_CADENCE_GROUPS", () => {
  it("propose les fréquences groupées par unité, en toutes lettres", () => {
    expect(TONTINE_CADENCE_GROUPS.map((group) => group.title)).toEqual([
      "Au jour",
      "À la semaine",
      "Au mois",
    ]);
    expect(TONTINE_CADENCE_GROUPS[1]?.options.slice(0, 2).map((option) => option.label)).toEqual([
      "Chaque semaine",
      "Toutes les 2 semaines",
    ]);
  });
});

describe("tontineInvalidFields", () => {
  it("ne signale aucun champ d'un formulaire valide", () => {
    expect(tontineInvalidFields(VALID_FORM)).toEqual({
      name: false,
      contribution: false,
      participants: false,
    });
  });

  it("signale les champs vides ou mal saisis", () => {
    expect(
      tontineInvalidFields({
        ...VALID_FORM,
        name: "T",
        contribution: "0",
        participants: 1,
      }),
    ).toEqual({ name: true, contribution: true, participants: true });
  });
});

describe("tontineStepError", () => {
  it("découpe la saisie en quatre étapes", () => {
    expect(TONTINE_FORM_STEPS).toEqual([
      "L'essentiel",
      "La fréquence",
      "Les participants",
      "Le récapitulatif",
    ]);
  });

  it("ne valide à la première étape que le nom et la cotisation", () => {
    expect(tontineStepError({ ...VALID_FORM, participants: 1 }, 0)).toBeNull();
    expect(tontineStepError({ ...VALID_FORM, name: "" }, 0)).toBe("Donnez un nom à la tontine.");
    expect(tontineStepError({ ...VALID_FORM, contribution: "0" }, 0)).toBe(
      "Saisissez une cotisation valide en FCFA.",
    );
  });

  it("valide la fréquence à la deuxième étape", () => {
    expect(tontineStepError({ ...VALID_FORM, cadence: "x" }, 1)).toBe(
      "Choisissez une fréquence dans la liste.",
    );
    expect(tontineStepError(VALID_FORM, 1)).toBeNull();
  });

  it("valide les participants à la troisième étape", () => {
    expect(tontineStepError({ ...VALID_FORM, participants: 51 }, 2)).toBe(
      "Indiquez entre 2 et 50 participants.",
    );
    expect(tontineStepError(VALID_FORM, 2)).toBeNull();
  });

  it("valide tout le formulaire au récapitulatif", () => {
    expect(tontineStepError({ ...VALID_FORM, participants: 1 }, 3)).toBe(
      "Indiquez entre 2 et 50 participants.",
    );
    expect(tontineStepError(VALID_FORM, 3)).toBeNull();
  });
});
