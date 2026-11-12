import { z } from "zod";

import { parseAmountInput } from "./model.amount-input";
import { parseCountInput } from "./model.count-input";
import type { FormResult } from "./model.form-result";
import { formError, formOk } from "./model.form-result";

/** Longueur minimale d'un nom saisi dans un formulaire. */
const NAME_MIN_LENGTH = 3;

/**
 * Longueur maximale d'un nom de tontine ou de carte : il tient sur une ligne
 * des cartes et des notifications sans être coupé.
 */
export const NAME_MAX_LENGTH = 30;

/** Caractères admis : lettres (accentuées comprises), chiffres, espaces et ponctuation courante. */
const NAME_CHARACTERS = /^[\p{L}\p{M}\d '’\-.&()]+$/u;

/** Au moins une lettre : un nom fait seulement de chiffres ou de signes ne désigne rien. */
const NAME_LETTER = /\p{L}/u;

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
 * Nettoie un nom saisi : espaces retirés aux bords, un seul espace entre les mots.
 * @param text Nom saisi.
 * @returns Le nom nettoyé.
 */
function cleanName(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Construit le schéma d'un nom de tontine ou de carte : nettoyé, de 3 à 30
 * caractères, avec au moins une lettre et sans caractère exotique (emoji,
 * symbole) qui s'afficherait mal dans les listes et les notifications.
 * @param emptyMessage Message affiché quand le nom est vide.
 * @returns Le schéma du champ, qui rend le nom nettoyé.
 */
export function nameSchema(emptyMessage: string) {
  return z
    .string()
    .transform(cleanName)
    .pipe(
      z
        .string()
        .min(1, emptyMessage)
        .min(NAME_MIN_LENGTH, `Le nom doit contenir au moins ${NAME_MIN_LENGTH} caractères.`)
        .max(NAME_MAX_LENGTH, `Le nom ne peut pas dépasser ${NAME_MAX_LENGTH} caractères.`)
        .regex(
          NAME_CHARACTERS,
          "Le nom ne peut contenir que des lettres, des chiffres, des espaces et - ' . & ( ).",
        )
        .regex(NAME_LETTER, "Le nom doit contenir au moins une lettre."),
    );
}

/**
 * Indique si un nom saisi respecte toutes les règles de {@link nameSchema}.
 * @param text Nom saisi.
 * @returns Vrai si le nom est acceptable.
 */
export function isValidNameInput(text: string): boolean {
  return nameSchema("").safeParse(text).success;
}

/**
 * Compteur affiché sous le champ du nom, espaces superflus non comptés.
 * @param text Nom saisi.
 * @returns Par exemple « 17/30 ».
 */
export function nameCounter(text: string): string {
  return `${cleanName(text).length}/${NAME_MAX_LENGTH}`;
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
