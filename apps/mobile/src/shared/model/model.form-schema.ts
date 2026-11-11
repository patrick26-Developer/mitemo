import { z } from "zod";

import { parseAmountInput } from "./model.amount-input";
import { parseCountInput } from "./model.count-input";
import type { FormResult } from "./model.form-result";
import { formError, formOk } from "./model.form-result";

/** Longueur minimale d'un nom saisi dans un formulaire. */
const NAME_MIN_LENGTH = 3;

/** Longueur maximale d'un nom saisi dans un formulaire. */
const NAME_MAX_LENGTH = 60;

/** Message affiché quand zod ne fournit aucune explication exploitable. */
const FALLBACK_ERROR = "Vérifiez la saisie.";

/** Bornes d'un entier saisi au clavier. */
export interface CountRule {
  /** Valeur minimale acceptée, incluse. */
  readonly min: number;
  /** Valeur maximale acceptée, incluse. */
  readonly max: number;
  /** Message affiché quand la saisie est vide ou hors bornes. */
  readonly message: string;
}

/**
 * Construit le schéma d'un nom obligatoire : espaces retirés, longueur bornée
 * entre 3 et 60 caractères.
 * @param emptyMessage Message affiché quand le nom est vide.
 * @returns Le schéma du champ, qui rend le nom nettoyé.
 */
export function nameSchema(emptyMessage: string) {
  return z
    .string()
    .trim()
    .min(1, emptyMessage)
    .min(NAME_MIN_LENGTH, `Le nom doit contenir au moins ${NAME_MIN_LENGTH} caractères.`)
    .max(NAME_MAX_LENGTH, `Le nom ne peut pas dépasser ${NAME_MAX_LENGTH} caractères.`);
}

/**
 * Construit le schéma d'un montant saisi au clavier, en francs CFA entiers.
 * @param message Message affiché quand la saisie n'est pas un montant positif.
 * @returns Le schéma du champ, qui rend le montant en plus petite unité.
 */
export function amountSchema(message: string) {
  return z.string().transform((text, ctx) => {
    const amount = parseAmountInput(text);

    if (amount === null) {
      ctx.addIssue(message);
      return z.NEVER;
    }

    return amount;
  });
}

/**
 * Construit le schéma d'un entier saisi au clavier, borné des deux côtés.
 * @param rule Bornes acceptées et message d'erreur.
 * @returns Le schéma du champ, qui rend l'entier validé.
 */
export function countSchema(rule: CountRule) {
  return z.string().transform((text, ctx) => {
    const count = parseCountInput(text, rule.max);

    if (count === null || count < rule.min) {
      ctx.addIssue(rule.message);
      return z.NEVER;
    }

    return count;
  });
}

/**
 * Valide une saisie avec un schéma zod et convertit le premier message
 * d'erreur en résultat de formulaire.
 * @param schema Schéma appliqué à la saisie.
 * @param input Saisie brute, validée avant usage.
 * @returns La valeur validée, ou le message de la première erreur.
 */
export function parseWithSchema<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
): FormResult<z.output<Schema>> {
  const parsed = schema.safeParse(input);
  if (parsed.success) return formOk(parsed.data);

  return formError(parsed.error.issues[0]?.message ?? FALLBACK_ERROR);
}
