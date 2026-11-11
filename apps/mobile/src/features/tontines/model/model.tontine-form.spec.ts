import {
  INITIAL_TONTINE_FORM,
  TONTINE_CADENCE_OPTIONS,
  TONTINE_FORM_STEPS,
  parseTontineForm,
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
  participants: "6",
  rounds: "10",
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
      totalRounds: 10,
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
      message: "Le nom ne peut pas dépasser 60 caractères.",
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
    expect(parseTontineForm({ ...VALID_FORM, cadence: "semaine-9" as never })).toEqual({
      ok: false,
      message: "Choisissez une fréquence dans la liste.",
    });
  });

  it("refuse moins de deux participants", () => {
    expect(parseTontineForm({ ...VALID_FORM, participants: "1" })).toEqual({
      ok: false,
      message: "Indiquez entre 2 et 50 participants.",
    });
  });

  it("refuse plus de cinquante participants", () => {
    expect(parseTontineForm({ ...VALID_FORM, participants: "51" })).toEqual({
      ok: false,
      message: "Indiquez entre 2 et 50 participants.",
    });
  });

  it("refuse un nombre de tours invalide", () => {
    expect(parseTontineForm({ ...VALID_FORM, rounds: "0" })).toEqual({
      ok: false,
      message: "Indiquez entre 1 et 100 tours.",
    });
  });

  it("exige au moins un tour par participant", () => {
    expect(parseTontineForm({ ...VALID_FORM, participants: "6", rounds: "5" })).toEqual({
      ok: false,
      message: "Prévoyez au moins un tour par participant.",
    });
  });

  it("accepte autant de tours que de participants", () => {
    expect(parseTontineForm({ ...VALID_FORM, participants: "6", rounds: "6" }).ok).toBe(true);
  });
});

describe("tontineRecap", () => {
  it("résume la cagnotte et la fréquence", () => {
    expect(tontineRecap({ ...VALID_FORM, cadence: "semaine-2" })).toEqual({
      pot: 25_000n,
      frequency: { unit: "semaine", interval: 2 },
    });
  });

  it("n'affiche pas de cagnotte tant que la saisie est incomplète", () => {
    expect(tontineRecap({ ...VALID_FORM, contribution: "" }).pot).toBeNull();
    expect(tontineRecap({ ...VALID_FORM, participants: "1" }).pot).toBeNull();
  });

  it("ignore une fréquence hors de la liste", () => {
    expect(tontineRecap({ ...VALID_FORM, cadence: "semaine-9" as never }).frequency).toBeNull();
  });
});

describe("TONTINE_CADENCE_OPTIONS", () => {
  it("propose les fréquences en toutes lettres, sans saisie d'intervalle", () => {
    expect(TONTINE_CADENCE_OPTIONS.map((option) => option.label)).toEqual([
      "Chaque jour",
      "Tous les 2 jours",
      "Tous les 3 jours",
      "Chaque semaine",
      "Toutes les 2 semaines",
      "Chaque mois",
      "Tous les 2 mois",
      "Tous les 3 mois",
    ]);
  });
});

describe("tontineStepError", () => {
  it("découpe le formulaire en trois étapes", () => {
    expect(TONTINE_FORM_STEPS).toEqual(["L'essentiel", "La fréquence", "Les participants"]);
  });

  it("ne valide à la première étape que le nom et la cotisation", () => {
    expect(tontineStepError({ ...VALID_FORM, participants: "1" }, 0)).toBeNull();
    expect(tontineStepError({ ...VALID_FORM, name: "" }, 0)).toBe("Donnez un nom à la tontine.");
    expect(tontineStepError({ ...VALID_FORM, contribution: "0" }, 0)).toBe(
      "Saisissez une cotisation valide en FCFA.",
    );
  });

  it("valide la fréquence à la deuxième étape", () => {
    expect(tontineStepError({ ...VALID_FORM, cadence: "x" as never }, 1)).toBe(
      "Choisissez une fréquence dans la liste.",
    );
    expect(tontineStepError(VALID_FORM, 1)).toBeNull();
  });

  it("valide tout le formulaire à la dernière étape", () => {
    expect(tontineStepError({ ...VALID_FORM, rounds: "5" }, 2)).toBe(
      "Prévoyez au moins un tour par participant.",
    );
    expect(tontineStepError(VALID_FORM, 2)).toBeNull();
  });
});
