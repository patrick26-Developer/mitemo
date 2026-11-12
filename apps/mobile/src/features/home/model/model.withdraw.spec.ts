import { parseWithdrawAmount } from "./model.withdraw";

describe("parseWithdrawAmount", () => {
  it("rend le montant saisi quand le solde le couvre", () => {
    expect(parseWithdrawAmount("5 000", 20_000n)).toEqual({ ok: true, value: 5_000n });
    expect(parseWithdrawAmount("20000", 20_000n)).toEqual({ ok: true, value: 20_000n });
  });

  it("refuse une saisie vide ou nulle", () => {
    expect(parseWithdrawAmount("", 20_000n)).toEqual({
      ok: false,
      message: "Saisissez le montant à retirer, en FCFA.",
    });
    expect(parseWithdrawAmount("0", 20_000n)).toMatchObject({ ok: false });
  });

  it("refuse un montant supérieur au solde disponible", () => {
    expect(parseWithdrawAmount("25000", 20_000n)).toEqual({
      ok: false,
      message: "Votre solde disponible est insuffisant.",
    });
  });
});
