import { z } from "zod";

import {
  amountSchema,
  countSchema,
  isValidNameInput,
  nameSchema,
  parseWithSchema,
} from "./model.form-schema";

describe("isValidNameInput", () => {
  it("accepte un nom de 3 à 60 caractères utiles", () => {
    expect(isValidNameInput("  Tontine  ")).toBe(true);
  });

  it("refuse un nom trop court ou trop long", () => {
    expect(isValidNameInput("ab")).toBe(false);
    expect(isValidNameInput("a".repeat(61))).toBe(false);
  });
});

describe("nameSchema", () => {
  const schema = nameSchema("Donnez un nom.");

  it("nettoie les espaces autour du nom", () => {
    expect(parseWithSchema(schema, "  Tontine du Marché  ")).toEqual({
      ok: true,
      value: "Tontine du Marché",
    });
  });

  it("refuse un nom vide avec le message fourni", () => {
    expect(parseWithSchema(schema, "   ")).toEqual({ ok: false, message: "Donnez un nom." });
  });

  it("impose entre 3 et 60 caractères", () => {
    expect(parseWithSchema(schema, "ab")).toEqual({
      ok: false,
      message: "Le nom doit contenir au moins 3 caractères.",
    });
    expect(parseWithSchema(schema, "a".repeat(61))).toEqual({
      ok: false,
      message: "Le nom ne peut pas dépasser 60 caractères.",
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
