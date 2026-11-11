import { INITIAL_TONTINE_FORM, parseTontineForm } from "./model.tontine-form";

/** Formulaire complet valide. */
const VALID_FORM = {
  ...INITIAL_TONTINE_FORM,
  name: "Tontine du Quartier",
  contribution: "5000",
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
