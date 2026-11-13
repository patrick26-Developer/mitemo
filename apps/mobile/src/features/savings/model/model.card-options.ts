import { formatAmount } from "../../../shared/format/format.amount";
import type { CardEdit } from "../../../shared/member/model.card-edit";
import { cardLevel } from "../../../shared/member/model.card-tint";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { parseAmountInput } from "../../../shared/model/model.amount-input";

/** Nom de la couleur de chaque niveau, du premier au cinquième. */
const LEVEL_COLOR_NAMES = ["verte", "bleue", "sable", "rose", "lavande"] as const;

/** Explication du niveau d'une carte, pour la feuille d'options. */
export interface CardLevelText {
  readonly title: string;
  readonly body: string;
}

/**
 * Explique le niveau d'une carte et pourquoi elle a cette couleur : c'est le
 * montant de son pointage qui la place dans l'une des cinq tranches.
 * @param card Carte concernée.
 * @returns Le titre et l'explication.
 */
export function cardLevelText(card: SavingsCard): CardLevelText {
  const { level, total, from, to } = cardLevel(card.markerAmount);
  const color = LEVEL_COLOR_NAMES[level - 1] ?? LEVEL_COLOR_NAMES[0];
  const range =
    to === null
      ? `de ${formatAmount(from)} FCFA ou plus. Vous êtes au plus haut niveau, bravo !`
      : `de ${formatAmount(from)} à ${formatAmount(to)} FCFA. Plus vos pointages sont grands, plus la carte monte de niveau et change de couleur.`;

  return {
    title: `Niveau ${level} sur ${total} · carte ${color}`,
    body: `Votre carte est ${color} parce que chaque pointage est ${range}`,
  };
}

/** Saisie de la modification d'une carte. */
export interface CardEditForm {
  readonly name: string;
  readonly goal: string;
  readonly markerAmount: string;
}

/**
 * Préremplit le formulaire avec la carte.
 * @param card Carte à modifier.
 * @returns Les champs, en texte.
 */
export function cardEditForm(card: SavingsCard): CardEditForm {
  return {
    name: card.name,
    goal: card.goal.toString(),
    markerAmount: card.markerAmount.toString(),
  };
}

/** Résultat de la validation de la saisie. */
export type CardEditResult =
  | { readonly ok: true; readonly value: CardEdit }
  | { readonly ok: false; readonly message: string };

/**
 * Valide la saisie : un nom, deux montants, et un pointage qui ne dépasse
 * pas l'objectif.
 * @param form Champs saisis.
 * @returns La modification, ou la raison du refus.
 */
export function parseCardEdit(form: CardEditForm): CardEditResult {
  const name = form.name.trim();
  if (name === "") return { ok: false, message: "Donnez un nom à la carte." };
  const goal = parseAmountInput(form.goal);
  const markerAmount = parseAmountInput(form.markerAmount);
  if (goal === null || markerAmount === null) {
    return { ok: false, message: "Indiquez l'objectif et le pointage." };
  }
  if (markerAmount > goal)
    return { ok: false, message: "Le pointage ne peut pas dépasser l'objectif." };

  return { ok: true, value: { name, goal, markerAmount } };
}
