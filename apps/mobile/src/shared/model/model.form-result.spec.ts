import { formError, formOk } from "./model.form-result";

describe("formOk", () => {
  it("enveloppe une valeur acceptée", () => {
    expect(formOk(5_000n)).toEqual({ ok: true, value: 5_000n });
  });
});

describe("formError", () => {
  it("porte le message à corriger", () => {
    expect(formError("Saisie invalide.")).toEqual({ ok: false, message: "Saisie invalide." });
  });
});
