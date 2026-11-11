import { parseTransfer, transferRecap } from "./model.tontine-transfer";

describe("parseTransfer", () => {
  it("refuse un transfert sans destinataire", () => {
    expect(parseTransfer("", "5000")).toEqual({
      ok: false,
      message: "Choisissez un destinataire.",
    });
  });

  it("refuse un montant invalide", () => {
    expect(parseTransfer("m2", "0")).toEqual({
      ok: false,
      message: "Saisissez un montant valide en FCFA.",
    });
  });

  it("accepte un destinataire et un montant positif", () => {
    expect(parseTransfer("m2", "5 000")).toEqual({ ok: true, value: 5_000n });
  });
});

describe("transferRecap", () => {
  it("ne résume aucun montant tant que la saisie est vide", () => {
    expect(transferRecap({ memberId: "", amount: "" })).toEqual({ amount: null });
  });

  it("résume le montant saisi, espaces de milliers tolérés", () => {
    expect(transferRecap({ memberId: "m2", amount: "2 500" })).toEqual({ amount: 2_500n });
  });

  it("ne résume pas un montant invalide", () => {
    expect(transferRecap({ memberId: "m2", amount: "0" })).toEqual({ amount: null });
  });
});
