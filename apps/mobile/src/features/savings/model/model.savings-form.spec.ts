import { INITIAL_SAVINGS_FORM, parseSavingsForm, savingsRecap } from "./model.savings-form";

/** Instant de référence, fixé pour que les tests ne dépendent pas de l'horloge. */
const NOW = new Date("2026-11-11T09:30:00.000Z");

/** Formulaire complet valide. */
const VALID_FORM = {
  ...INITIAL_SAVINGS_FORM,
  name: "Loyer de Février",
  markerAmount: "5000",
  markersTotal: "6",
  deadline: "28/02/2027",
};

describe("parseSavingsForm", () => {
  it("accepte une saisie complète et construit la carte", () => {
    const result = parseSavingsForm(VALID_FORM, NOW);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({
      name: "Loyer de Février",
      markerAmount: 5_000n,
      markersTotal: 6,
      deadline: "2027-02-28",
      tontineId: null,
    });
    expect(result.value.description).toContain("5 000 FCFA");
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

  it("refuse un nom trop court", () => {
    expect(parseSavingsForm({ ...VALID_FORM, name: "ab" }, NOW)).toEqual({
      ok: false,
      message: "Le nom doit contenir au moins 3 caractères.",
    });
  });

  it("refuse un nom trop long", () => {
    expect(parseSavingsForm({ ...VALID_FORM, name: "a".repeat(61) }, NOW)).toEqual({
      ok: false,
      message: "Le nom ne peut pas dépasser 60 caractères.",
    });
  });

  it("refuse un montant de marqueur invalide", () => {
    expect(parseSavingsForm({ ...VALID_FORM, markerAmount: "0" }, NOW)).toEqual({
      ok: false,
      message: "Saisissez le montant d'un marqueur en FCFA.",
    });
  });

  it("refuse trop de marqueurs", () => {
    expect(parseSavingsForm({ ...VALID_FORM, markersTotal: "101" }, NOW)).toEqual({
      ok: false,
      message: "Indiquez entre 1 et 100 marqueurs.",
    });
  });

  it("refuse une échéance invalide", () => {
    expect(parseSavingsForm({ ...VALID_FORM, deadline: "30/02/2027" }, NOW)).toEqual({
      ok: false,
      message: "Saisissez une échéance au format JJ/MM/AAAA.",
    });
  });

  it("refuse une échéance déjà passée", () => {
    expect(parseSavingsForm({ ...VALID_FORM, deadline: "10/11/2026" }, NOW)).toEqual({
      ok: false,
      message: "Choisissez une échéance postérieure à aujourd'hui.",
    });
  });

  it("refuse l'échéance du jour même", () => {
    expect(parseSavingsForm({ ...VALID_FORM, deadline: "11/11/2026" }, NOW)).toEqual({
      ok: false,
      message: "Choisissez une échéance postérieure à aujourd'hui.",
    });
  });

  it("accepte l'échéance du lendemain", () => {
    expect(parseSavingsForm({ ...VALID_FORM, deadline: "12/11/2026" }, NOW).ok).toBe(true);
  });
});

describe("savingsRecap", () => {
  it("résume l'objectif et l'échéance", () => {
    expect(savingsRecap(VALID_FORM)).toEqual({ goal: 30_000n, deadline: "2027-02-28" });
  });

  it("n'affiche pas d'objectif tant que la saisie est incomplète", () => {
    expect(savingsRecap({ ...VALID_FORM, markerAmount: "" }).goal).toBeNull();
    expect(savingsRecap({ ...VALID_FORM, markersTotal: "0" }).goal).toBeNull();
  });

  it("ignore une échéance invalide", () => {
    expect(savingsRecap({ ...VALID_FORM, deadline: "30/02/2027" }).deadline).toBeNull();
  });
});
