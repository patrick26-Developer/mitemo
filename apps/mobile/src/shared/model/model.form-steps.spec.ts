import { nextStep, previousStep, stepError } from "./model.form-steps";
import { z } from "zod";

describe("nextStep", () => {
  it("avance d'une étape sans dépasser la dernière", () => {
    expect(nextStep(0, 2)).toBe(1);
    expect(nextStep(1, 2)).toBe(1);
  });
});

describe("previousStep", () => {
  it("recule d'une étape sans passer sous la première", () => {
    expect(previousStep(1)).toBe(0);
    expect(previousStep(0)).toBe(0);
  });
});

describe("stepError", () => {
  const schema = z.object({ name: z.string().min(1, "Donnez un nom.") });

  it("renvoie le message de la première erreur", () => {
    expect(stepError(schema, { name: "" })).toBe("Donnez un nom.");
  });

  it("ne renvoie rien quand l'étape est valide", () => {
    expect(stepError(schema, { name: "Tontine" })).toBeNull();
  });
});
