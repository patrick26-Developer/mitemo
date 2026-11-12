import { formatAmount } from "../../../shared/format/format.amount";
import { TONTINE_TINTS } from "../../../shared/member/model.tontine-settings";
import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { parseTontineSettings, rulesLocked, settingsFormOf } from "./model.tontine-settings-form";

describe("settingsFormOf", () => {
  it("préremplit le formulaire avec les réglages actuels", () => {
    expect(settingsFormOf(makeTontine())).toEqual({
      name: "Tontine de test",
      contribution: "5000",
      cadence: "semaine-1",
      tint: 0,
    });
  });
});

describe("parseTontineSettings", () => {
  const tontine = makeTontine({ state: "PENDING" });

  it("rend les réglages validés, avec une description à jour", () => {
    const form = {
      name: " Tontine  des Amis ",
      contribution: "10 000",
      cadence: "mois-1",
      tint: 2,
    };

    expect(parseTontineSettings(form)).toEqual({
      ok: true,
      value: {
        name: "Tontine des Amis",
        description: `Tontine des Amis : cotisation de ${formatAmount(10_000n)} FCFA, chaque mois.`,
        headerColors: TONTINE_TINTS[2],
        contribution: 10_000n,
        frequency: { unit: "mois", interval: 1 },
      },
    });
    expect(rulesLocked(tontine)).toBe(false);
  });

  it("refuse un nom invalide ou une cotisation vide", () => {
    const form = settingsFormOf(tontine);

    expect(parseTontineSettings({ ...form, name: "ab" })).toEqual({
      ok: false,
      message: "Le nom doit contenir au moins 3 caractères.",
    });
    expect(parseTontineSettings({ ...form, contribution: "" })).toMatchObject({ ok: false });
  });

  it("verrouille les règles d'une tontine lancée", () => {
    expect(rulesLocked(makeTontine())).toBe(true);
  });
});
