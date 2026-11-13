import { OFFLINE_ACTION, offlineDock } from "./model.offline-dock";

const PAY = { label: "Pointer 5 500 FCFA", onPress: jest.fn() };
const WITHDRAW = { label: "Retirer", onPress: jest.fn() };

describe("offlineDock", () => {
  it("garde les actions quand le réseau est là", () => {
    expect(offlineDock({ primary: PAY, secondary: WITHDRAW }, true)).toEqual({
      primary: PAY,
      secondary: WITHDRAW,
    });
  });

  it("remplace toute transaction par un bouton grisé hors connexion", () => {
    expect(offlineDock({ primary: PAY, secondary: WITHDRAW }, false)).toEqual({
      primary: OFFLINE_ACTION,
      secondary: null,
    });
    expect(OFFLINE_ACTION).toMatchObject({ label: "Hors connexion", tone: "disabled" });
  });

  it("n'invente pas de bouton quand il n'y a rien à faire", () => {
    expect(offlineDock({ primary: null, secondary: null }, false)).toEqual({
      primary: null,
      secondary: null,
    });
  });
});
