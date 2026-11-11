import { payStageFor, pendingInstructions } from "./model.pay-flow";

describe("payStageFor", () => {
  it("attend la validation sur le téléphone pour MTN et Airtel", () => {
    expect(payStageFor("MTN_MOMO")).toBe("pending");
    expect(payStageFor("AIRTEL_MONEY")).toBe("pending");
  });

  it("demande le code PIN pour un paiement depuis Mitemo", () => {
    expect(payStageFor("MITEMO")).toBe("pin");
  });
});

describe("pendingInstructions", () => {
  it("explique en trois étapes comment payer avec MTN MoMo", () => {
    expect(pendingInstructions("MTN_MOMO", 5_000n)).toEqual([
      "Une demande de paiement de 5 000 FCFA vient d'être envoyée sur votre compte MTN MoMo.",
      "Composez *105# sur votre téléphone et confirmez le paiement.",
      "Revenez ensuite sur Mitemo : le paiement se valide tout seul dès sa confirmation.",
    ]);
  });

  it("donne le code d'Airtel Money", () => {
    expect(pendingInstructions("AIRTEL_MONEY", 5_000n)[1]).toBe(
      "Composez *128# sur votre téléphone et confirmez le paiement.",
    );
  });
});
