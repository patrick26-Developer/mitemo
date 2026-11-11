import {
  PAYMENT_METHODS,
  isMobileMoney,
  paymentMethodLabel,
  paymentMethodName,
} from "./model.payment-method";

describe("moyens de paiement", () => {
  it("propose MTN MoMo, Airtel Money et le solde Mitemo", () => {
    expect(PAYMENT_METHODS).toEqual(["MTN_MOMO", "AIRTEL_MONEY", "MITEMO"]);
  });

  it("nomme chaque moyen pour le bouton de paiement", () => {
    expect(paymentMethodName("MTN_MOMO")).toBe("MTN MoMo");
    expect(paymentMethodName("AIRTEL_MONEY")).toBe("Airtel Money");
    expect(paymentMethodName("MITEMO")).toBe("Mitemo");
  });

  it("nomme chaque moyen dans l'historique", () => {
    expect(paymentMethodLabel("MTN_MOMO")).toBe("MTN MoMo");
    expect(paymentMethodLabel("AIRTEL_MONEY")).toBe("Airtel Money");
    expect(paymentMethodLabel("MITEMO")).toBe("Solde Mitemo");
  });

  it("distingue le Mobile Money, validé sur le téléphone, du solde Mitemo", () => {
    expect(isMobileMoney("MTN_MOMO")).toBe(true);
    expect(isMobileMoney("AIRTEL_MONEY")).toBe(true);
    expect(isMobileMoney("MITEMO")).toBe(false);
  });
});
