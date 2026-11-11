import { INITIAL_SAVINGS_FORM, parseSavingsForm } from "./model.savings-form";

/** Formulaire complet valide. */
const VALID_FORM = {
  ...INITIAL_SAVINGS_FORM,
  name: "Loyer de Février",
  markerAmount: "5000",
  markersTotal: "6",
  deadline: "2027-02-28",
};

describe("parseSavingsForm", () => {
  it("accepte une saisie complète et construit la carte", () => {
    const result = parseSavingsForm(VALID_FORM);

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
    const result = parseSavingsForm({ ...VALID_FORM, tontineId: "t1" });

    expect(result.ok && result.value.tontineId).toBe("t1");
  });

  it("refuse un nom vide", () => {
    expect(parseSavingsForm({ ...VALID_FORM, name: "   " })).toEqual({
      ok: false,
      message: "Donnez un nom à la carte.",
    });
  });

  it("refuse un montant de marqueur invalide", () => {
    expect(parseSavingsForm({ ...VALID_FORM, markerAmount: "0" })).toEqual({
      ok: false,
      message: "Saisissez le montant d'un marqueur en FCFA.",
    });
  });

  it("refuse trop de marqueurs", () => {
    expect(parseSavingsForm({ ...VALID_FORM, markersTotal: "101" })).toEqual({
      ok: false,
      message: "Indiquez entre 1 et 100 marqueurs.",
    });
  });

  it("refuse une échéance invalide", () => {
    expect(parseSavingsForm({ ...VALID_FORM, deadline: "2027-02-30" })).toEqual({
      ok: false,
      message: "Saisissez une échéance au format AAAA-MM-JJ.",
    });
  });
});
