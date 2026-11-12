import { z } from "zod";

import {
  amountSchema,
  countSchema,
  isValidNameInput,
  NAME_MAX_LENGTH,
  nameCounter,
  nameSchema,
  parseWithSchema,
} from "./model.form-schema";

describe("isValidNameInput", () => {
  it("accepte un nom de 3 à 30 caractères utiles", () => {
    expect(isValidNameInput("  Tontine  ")).toBe(true);
    expect(isValidNameInput("a".repeat(NAME_MAX_LENGTH))).toBe(true);
  });

  it("refuse un nom trop court, trop long, sans lettre ou avec un caractère interdit", () => {
    expect(isValidNameInput("ab")).toBe(false);
    expect(isValidNameInput("a".repeat(NAME_MAX_LENGTH + 1))).toBe(false);
    expect(isValidNameInput("2026")).toBe(false);
    expect(isValidNameInput("Tontine 🎉")).toBe(false);
  });
});

describe("nameCounter", () => {
  it("compte les caractères utiles sur le maximum autorisé", () => {
    expect(nameCounter("  Tontine   du marché ")).toBe("17/30");
    expect(nameCounter("")).toBe("0/30");
  });
});

describe("nameSchema", () => {
  const schema = nameSchema("Donnez un nom.");

  it("nettoie les espaces autour du nom et entre les mots", () => {
    expect(parseWithSchema(schema, "  Tontine   du Marché  ")).toEqual({
      ok: true,
      value: "Tontine du Marché",
    });
  });

  it("accepte lettres accentuées, chiffres et ponctuation courante", () => {
    expect(parseWithSchema(schema, "Épargne d'Aïcha - 2026 (N°1)")).toEqual({
      ok: false,
      message: "Le nom ne peut contenir que des lettres, des chiffres, des espaces et - ' . & ( ).",
    });
    expect(parseWithSchema(schema, "Épargne d’Aïcha - 2026 (1)")).toEqual({
      ok: true,
      value: "Épargne d’Aïcha - 2026 (1)",
    });
  });

  it("refuse un nom vide avec le message fourni", () => {
    expect(parseWithSchema(schema, "   ")).toEqual({ ok: false, message: "Donnez un nom." });
  });

  it("impose entre 3 et 30 caractères", () => {
    expect(parseWithSchema(schema, "ab")).toEqual({
      ok: false,
      message: "Le nom doit contenir au moins 3 caractères.",
    });
    expect(parseWithSchema(schema, "a".repeat(31))).toEqual({
      ok: false,
      message: "Le nom ne peut pas dépasser 30 caractères.",
    });
  });

  it("exige au moins une lettre", () => {
    expect(parseWithSchema(schema, "2026")).toEqual({
      ok: false,
      message: "Le nom doit contenir au moins une lettre.",
    });
  });
});

describe("amountSchema", () => {
  const schema = amountSchema("Montant invalide.");

  it("lit un montant positif", () => {
    expect(parseWithSchema(schema, "5 000")).toEqual({ ok: true, value: 5_000n });
  });

  it("refuse un montant nul", () => {
    expect(parseWithSchema(schema, "0")).toEqual({ ok: false, message: "Montant invalide." });
  });
});

describe("countSchema", () => {
  const schema = countSchema({ min: 2, max: 5, message: "Entre 2 et 5." });

  it("accepte une valeur dans les bornes", () => {
    expect(parseWithSchema(schema, "3")).toEqual({ ok: true, value: 3 });
  });

  it("refuse une valeur hors bornes", () => {
    expect(parseWithSchema(schema, "1")).toEqual({ ok: false, message: "Entre 2 et 5." });
    expect(parseWithSchema(schema, "6")).toEqual({ ok: false, message: "Entre 2 et 5." });
  });
});

describe("parseWithSchema", () => {
  it("renvoie le premier message d'erreur", () => {
    const schema = z.object({
      first: z.string().min(1, "Premier champ requis."),
      second: z.string().min(1, "Second champ requis."),
    });

    expect(parseWithSchema(schema, { first: "", second: "" })).toEqual({
      ok: false,
      message: "Premier champ requis.",
    });
  });
});
