import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { takenTurns } from "../../../shared/member/model.tontine-turns";
import {
  beneficiaryName,
  formatFrequency,
  paidMemberCount,
  tontinePot,
} from "../../../shared/member/model.portfolio";

/** Nature de chaque ligne du récapitulatif d'une tontine, qui décide de son icône. */
export const TONTINE_FACT_KINDS = ["pot", "beneficiary", "paid", "remaining"] as const;

/** Nature d'une ligne du récapitulatif. Voir {@link TONTINE_FACT_KINDS}. */
export type TontineFactKind = (typeof TONTINE_FACT_KINDS)[number];

/** Ligne d'information de la carte récapitulative d'une tontine. */
export interface TontineFactRow {
  readonly kind: TontineFactKind;
  readonly label: string;
  readonly value: string;
}

/** Étape de la tontine et son détail, affichés au-dessus de la progression. */
export interface TontineStatus {
  readonly label: string;
  readonly detail: string;
}

/** Ligne courte sous la cotisation : un libellé et sa valeur. */
export interface TontineGoalLine {
  readonly label: string;
  readonly value: string;
}

/**
 * Montant lisible en francs CFA.
 * @param amount Montant en plus petite unité de la devise.
 * @returns Le montant suivi de « FCFA ».
 */
function fcfa(amount: bigint): string {
  return `${formatAmount(amount)} FCFA`;
}

/**
 * Décrit l'étape de la tontine : tours pris avant le départ, tour en cours
 * pendant le cycle, puis fin du cycle.
 * @param tontine Tontine concernée.
 * @returns L'étape et son détail.
 */
export function tontineStatus(tontine: Tontine): TontineStatus {
  const { round, totalRounds } = tontine;
  if (tontine.state === "PENDING") {
    return {
      label: "En préparation",
      detail: `${takenTurns(tontine)} sur ${totalRounds} tours pris`,
    };
  }
  if (tontine.state === "COMPLETED") {
    return { label: "Terminée", detail: `${totalRounds} tours sur ${totalRounds}` };
  }
  return { label: "En cours", detail: `Tour ${round} sur ${totalRounds}` };
}

/**
 * Avancement de la tontine, entre 0 et 1 : tours pris avant le départ,
 * tours passés pendant le cycle, plein une fois terminée.
 * @param tontine Tontine concernée.
 * @returns La part accomplie.
 */
export function tontineProgress(tontine: Tontine): number {
  if (tontine.state === "COMPLETED") return 1;
  const done = tontine.state === "PENDING" ? takenTurns(tontine) : tontine.round;
  return tontine.totalRounds === 0 ? 0 : Math.min(done / tontine.totalRounds, 1);
}

/**
 * Détaille le plan sous la cotisation : son montant, sa fréquence et le
 * nombre de membres.
 * @param tontine Tontine concernée.
 * @returns Les trois lignes, dans l'ordre d'affichage.
 */
export function tontineGoalLines(tontine: Tontine): readonly TontineGoalLine[] {
  return [
    { label: "Cotisation", value: fcfa(tontine.contribution) },
    { label: "Fréquence", value: formatFrequency(tontine.frequency) },
    { label: "Membres", value: String(tontine.members.length) },
  ];
}

/**
 * Nombre de tours encore à venir : tous avant le départ, ceux après le tour en
 * cours pendant le cycle.
 * @param tontine Tontine concernée.
 * @returns Le nombre de tours restants, jamais négatif.
 */
function roundsLeft(tontine: Tontine): number {
  const left =
    tontine.state === "PENDING" ? tontine.totalRounds : tontine.totalRounds - tontine.round;
  return Math.max(left, 0);
}

/**
 * Construit les lignes d'information d'une tontine : cagnotte du tour,
 * bénéficiaire et cotisations reçues pendant le cycle, puis tours restants.
 * @param tontine Tontine concernée.
 * @returns Les lignes, dans l'ordre d'affichage.
 */
export function tontineFactRows(tontine: Tontine): readonly TontineFactRow[] {
  const pot: TontineFactRow = {
    kind: "pot",
    label: "Restourne du tour",
    value: fcfa(tontinePot(tontine)),
  };
  const remaining: TontineFactRow = {
    kind: "remaining",
    label: "Tours restants",
    value: String(roundsLeft(tontine)),
  };
  if (tontine.state !== "ACTIVE") return [pot, remaining];

  const paid = `${paidMemberCount(tontine)} sur ${tontine.members.length}`;
  return [
    pot,
    { kind: "beneficiary", label: "Bénéficiaire", value: beneficiaryName(tontine) },
    { kind: "paid", label: "Cotisations reçues", value: paid },
    remaining,
  ];
}
