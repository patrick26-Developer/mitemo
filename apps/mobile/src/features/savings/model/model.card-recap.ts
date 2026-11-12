import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import { CARD_FEE_PERCENT } from "../../../shared/member/model.card-fee";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardGoal, formatFrequency, remainingToSave } from "../../../shared/member/model.portfolio";

/** Nature de chaque ligne du récapitulatif, qui décide de son icône. */
export const RECAP_FACT_KINDS = ["remaining", "fee", "created", "deadline", "tontine"] as const;

/** Nature d'une ligne du récapitulatif. Voir {@link RECAP_FACT_KINDS}. */
export type RecapFactKind = (typeof RECAP_FACT_KINDS)[number];

/** Ligne d'information de la carte récapitulative. */
export interface RecapFactRow {
  readonly kind: RecapFactKind;
  readonly label: string;
  readonly value: string;
}

/**
 * Construit les lignes d'information d'une carte : reste à épargner, frais
 * Mitemo, création, échéance, puis tontine liée quand elle existe.
 * @param card Carte concernée.
 * @param tontineName Nom de la tontine liée, `null` quand la carte est indépendante.
 * @returns Les lignes, dans l'ordre d'affichage.
 */
export function recapFactRows(
  card: SavingsCard,
  tontineName: string | null,
): readonly RecapFactRow[] {
  const fcfa = (amount: bigint) => `${formatAmount(amount)} FCFA`;
  const rows: RecapFactRow[] = [
    { kind: "remaining", label: "Reste à épargner", value: fcfa(remainingToSave(card)) },
    { kind: "fee", label: `Frais Mitemo (${CARD_FEE_PERCENT} %)`, value: fcfa(card.fee) },
    { kind: "created", label: "Créée le", value: formatLongDate(card.startDate) },
    { kind: "deadline", label: "Échéance", value: formatLongDate(card.deadline) },
  ];

  return tontineName === null
    ? rows
    : [...rows, { kind: "tontine", label: "Tontine liée", value: tontineName }];
}

/** Ligne courte sous le montant actuel : objectif, montant ou fréquence. */
export interface RecapGoalLine {
  readonly label: string;
  readonly value: string;
}

/**
 * Détaille le plan de la carte sous le montant actuel : son objectif, le
 * montant de chaque pointage et la fréquence des pointages.
 * @param card Carte concernée.
 * @returns Les trois lignes, dans l'ordre d'affichage.
 */
export function recapGoalLines(card: SavingsCard): readonly RecapGoalLine[] {
  return [
    { label: "Objectif", value: `${formatAmount(cardGoal(card))} FCFA` },
    { label: "Montant", value: `${formatAmount(card.markerAmount)} FCFA` },
    { label: "Fréquence", value: formatFrequency(card.frequency) },
  ];
}
