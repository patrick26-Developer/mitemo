import {
  INITIAL_SAVINGS_FORM,
  SAVINGS_FORM_STEPS,
  parseSavingsForm,
  savingsInvalidFields,
  savingsRecap,
  savingsStepError,
} from "./model.savings-form";
import type { SavingsFormState } from "./model.savings-form";

/** Instant de référence, fixé pour que les tests ne dépendent pas de l'horloge. */
const NOW = new Date("2026-11-11T09:30:00.000Z");

/** Formulaire complet valide. */
const VALID_FORM: SavingsFormState = {
  ...INITIAL_SAVINGS_FORM,
  name: "Loyer de Février",
  goal: "60000",
  markerAmount: "5000",
  cadence: "semaine-1",
  deadline: "2027-02-28",
};

describe("parseSavingsForm", () => {
  it("accepte une saisie complète et construit la carte", () => {
    const result = parseSavingsForm(VALID_FORM, NOW);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({
      name: "Loyer de Février",
      goal: 60_000n,
      markerAmount: 5_000n,
      markersTotal: 16,
      frequency: { unit: "semaine", interval: 1 },
      startDate: "2026-11-11",
      deadline: "2027-02-28",
      tontineId: null,
    });
    expect(result.value.description).toContain("16 pointages");
  });

  it("déduit les pointages du rythme mensuel", () => {
    const result = parseSavingsForm({ ...VALID_FORM, cadence: "mois-1" }, NOW);

    expect(result.ok && result.value.markersTotal).toBe(4);
    expect(result.ok && result.value.frequency).toEqual({ unit: "mois", interval: 1 });
  });

  it("conserve la tontine rattachée", () => {
    const result = parseSavingsForm({ ...VALID_FORM, tontineId: "t1" }, NOW);

    expect(result.ok && result.value.tontineId).toBe("t1");
  });

  it("refuse un nom vide", () => {
    expect(parseSavingsForm({ ...VALID_FORM, name: "   " }, NOW)).toEqual({
      ok: false,
      message: "Donnez un nom à la carte.",
    });
  });

  it("refuse un objectif invalide", () => {
    expect(parseSavingsForm({ ...VALID_FORM, goal: "0" }, NOW)).toEqual({
      ok: false,
      message: "Saisissez un objectif en FCFA.",
    });
  });

  it("refuse un montant de pointage invalide", () => {
    expect(parseSavingsForm({ ...VALID_FORM, markerAmount: "" }, NOW)).toEqual({
      ok: false,
      message: "Saisissez le montant proposé par pointage en FCFA.",
    });
  });

  it("refuse une fréquence hors de la liste", () => {
    expect(parseSavingsForm({ ...VALID_FORM, cadence: "annee-1" }, NOW)).toEqual({
      ok: false,
      message: "Choisissez une fréquence dans la liste.",
    });
  });

  it("refuse une échéance absente", () => {
    expect(parseSavingsForm({ ...VALID_FORM, deadline: "" }, NOW)).toEqual({
      ok: false,
      message: "Choisissez une date d'échéance.",
    });
  });

  it("refuse une échéance déjà passée", () => {
    expect(parseSavingsForm({ ...VALID_FORM, deadline: "2026-11-11" }, NOW)).toEqual({
      ok: false,
      message: "Choisissez une échéance postérieure à aujourd'hui.",
    });
  });
});

describe("savingsRecap", () => {
  it("résume l'objectif, le rythme et les pointages prévus", () => {
    expect(savingsRecap(VALID_FORM, NOW)).toEqual({
      goal: 60_000n,
      fee: 6_000n,
      markerAmount: 5_000n,
      frequency: { unit: "semaine", interval: 1 },
      markers: 16,
      deadline: "2027-02-28",
    });
  });

  it("n'affiche rien tant que la saisie est incomplète", () => {
    expect(savingsRecap({ ...VALID_FORM, goal: "" }, NOW).goal).toBeNull();
    expect(savingsRecap({ ...VALID_FORM, goal: "" }, NOW).fee).toBeNull();
    expect(savingsRecap({ ...VALID_FORM, deadline: "" }, NOW).markers).toBeNull();
    expect(savingsRecap({ ...VALID_FORM, cadence: "annee-1" }, NOW).frequency).toBeNull();
  });
});

describe("savingsInvalidFields", () => {
  it("signale les champs vides ou mal saisis", () => {
    expect(savingsInvalidFields(VALID_FORM)).toEqual({
      name: false,
      goal: false,
      markerAmount: false,
      deadline: false,
    });
    expect(
      savingsInvalidFields({ ...VALID_FORM, name: "T", goal: "", markerAmount: "0", deadline: "" }),
    ).toEqual({ name: true, goal: true, markerAmount: true, deadline: true });
  });
});

describe("savingsStepError", () => {
  it("découpe la saisie en deux étapes", () => {
    expect(SAVINGS_FORM_STEPS).toEqual(["Le projet", "Le rythme"]);
  });

  it("valide le projet sans attendre le rythme", () => {
    expect(savingsStepError({ ...VALID_FORM, deadline: "" }, 0, NOW)).toBeNull();
    expect(savingsStepError({ ...VALID_FORM, goal: "" }, 0, NOW)).toBe(
      "Saisissez un objectif en FCFA.",
    );
  });

  it("valide le rythme et l'échéance à la dernière étape", () => {
    expect(savingsStepError({ ...VALID_FORM, deadline: "2026-01-01" }, 1, NOW)).toBe(
      "Choisissez une échéance postérieure à aujourd'hui.",
    );
    expect(savingsStepError(VALID_FORM, 1, NOW)).toBeNull();
  });
});
