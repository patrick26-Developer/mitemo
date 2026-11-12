import { detailFocus, NO_FOCUS } from "./model.detail-focus";

describe("detailFocus", () => {
  it("ouvre le paiement ou la fiche d'un membre demandés par l'URL", () => {
    expect(detailFocus({ action: "pay" })).toEqual({ pay: true, memberId: null });
    expect(detailFocus({ member: ["m3", "m4"] })).toEqual({ pay: false, memberId: "m3" });
  });

  it("ignore une action inconnue ou un membre vide", () => {
    expect(detailFocus({ action: "supprimer", member: "" })).toEqual(NO_FOCUS);
  });
});
