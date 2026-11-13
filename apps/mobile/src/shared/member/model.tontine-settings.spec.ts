import { makeMember, makeTontine } from "../testing/fixtures.portfolio";
import { SELF_MEMBER_ID } from "./model.portfolio";
import { ForbiddenOperationError } from "./model.portfolio-error";
import { applyTontineSettings, TONTINE_TINTS, tontineSettingsOf } from "./model.tontine-settings";

/** Réglages modifiés : nom, couleur, cotisation et fréquence. */
const CHANGED = {
  name: "Tontine des Amis",
  description: "Tontine des Amis : cotisation de 10 000 FCFA, chaque mois.",
  headerColors: TONTINE_TINTS[2] ?? ["#000000", "#000000"],
  contribution: 10_000n,
  frequency: { unit: "mois", interval: 1 },
} as const;

describe("applyTontineSettings", () => {
  it("change le nom, la couleur et les règles d'une tontine à lancer", () => {
    const pending = makeTontine({ state: "PENDING" });

    expect(applyTontineSettings(pending, CHANGED)).toMatchObject(CHANGED);
  });

  it("change le nom et la couleur d'une tontine lancée", () => {
    const active = makeTontine();
    const settings = {
      ...tontineSettingsOf(active),
      name: "Nouveau nom",
      headerColors: CHANGED.headerColors,
    };

    expect(applyTontineSettings(active, settings)).toMatchObject({
      name: "Nouveau nom",
      headerColors: CHANGED.headerColors,
    });
  });

  it("refuse de changer les règles d'une tontine lancée", () => {
    expect(() => applyTontineSettings(makeTontine(), CHANGED)).toThrow(
      new ForbiddenOperationError("Les règles ne changent plus après le premier versement."),
    );
  });

  it("fige les règles dès le premier versement, même avant le lancement", () => {
    const paid = makeTontine({
      state: "PENDING",
      members: [makeMember(SELF_MEMBER_ID, "ADMIN"), makeMember("m2", "MEMBRE", true)],
    });

    expect(() => applyTontineSettings(paid, CHANGED)).toThrow(
      new ForbiddenOperationError("Les règles ne changent plus après le premier versement."),
    );
  });

  it("réserve les réglages à l'administrateur", () => {
    const simple = makeTontine({
      state: "PENDING",
      members: [makeMember(SELF_MEMBER_ID, "MEMBRE")],
    });

    expect(() => applyTontineSettings(simple, CHANGED)).toThrow(ForbiddenOperationError);
  });
});
