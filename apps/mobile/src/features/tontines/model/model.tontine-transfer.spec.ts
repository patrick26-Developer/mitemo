import { parseTransfer } from "./model.tontine-transfer";

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
