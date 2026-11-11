import type { z } from "zod";

import { parseWithSchema } from "./model.form-schema";

/**
 * Étape suivante d'un formulaire, bornée à la dernière.
 * @param index Étape courante, à partir de 0.
 * @param total Nombre d'étapes.
 * @returns L'indice de l'étape suivante.
 */
export function nextStep(index: number, total: number): number {
  return Math.min(index + 1, total - 1);
}

/**
 * Étape précédente d'un formulaire, bornée à la première.
 * @param index Étape courante, à partir de 0.
 * @returns L'indice de l'étape précédente.
 */
export function previousStep(index: number): number {
  return Math.max(index - 1, 0);
}

/**
 * Valide les champs d'une étape avant de passer à la suivante.
 * @param schema Schéma des seuls champs de l'étape.
 * @param form Saisie du formulaire.
 * @returns Le message de la première erreur, ou `null` si l'étape est valide.
 */
export function stepError(schema: z.ZodType, form: unknown): string | null {
  const parsed = parseWithSchema(schema, form);

  return parsed.ok ? null : parsed.message;
}
