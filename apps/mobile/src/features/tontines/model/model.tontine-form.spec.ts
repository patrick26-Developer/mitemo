import { INITIAL_TONTINE_FORM, parseTontineForm, tontineRecap } from "./model.tontine-form";

/** Formulaire complet valide. */
const VALID_FORM = {
  ...INITIAL_TONTINE_FORM,
  name: "Tontine du Quartier",
  contribution: "5000",
  interval: "1",
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
    const result = parseTontineForm({ ...VALID_FORM, interval: "2" });

    expect(result.ok && result.value.frequency).toEqual({ unit: "semaine", interval: 2 });
    expect(result.ok && result.value.description).toContain("toutes les 2 semaines");
  });

  it("refuse un nom vide", () => {
    expect(parseTontineForm({ ...VALID_FORM, name: "  " })).toEqual({
      ok: false,
      message: "Donnez un nom à la tontine.",
    });
  });

  it("refuse une cotisation invalide", () => {
    expect(parseTontineForm({ ...VALID_FORM, contribution: "0" })).toEqual({
      ok: false,
      message: "Saisissez une cotisation valide en FCFA.",
    });
  });

  it("refuse un intervalle invalide", () => {
    expect(parseTontineForm({ ...VALID_FORM, interval: "0" })).toEqual({
      ok: false,
      message: "Indiquez un intervalle entre 1 et 12.",
    });
    expect(parseTontineForm({ ...VALID_FORM, interval: "13" })).toEqual({
      ok: false,
      message: "Indiquez un intervalle entre 1 et 12.",
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
});

describe("tontineRecap", () => {
  it("résume la cagnotte et la fréquence", () => {
    expect(tontineRecap({ ...VALID_FORM, interval: "2" })).toEqual({
      pot: 25_000n,
      frequency: { unit: "semaine", interval: 2 },
    });
  });

  it("n'affiche pas de cagnotte tant que la saisie est incomplète", () => {
    expect(tontineRecap({ ...VALID_FORM, contribution: "" }).pot).toBeNull();
    expect(tontineRecap({ ...VALID_FORM, participants: "1" }).pot).toBeNull();
  });

  it("ignore une fréquence invalide", () => {
    expect(tontineRecap({ ...VALID_FORM, interval: "0" }).frequency).toBeNull();
  });
});
