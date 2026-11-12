import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import { markerStart } from "../../../shared/model/model.markers";

/** Intensité d'une case : rien, entamée, réglée, réglée au-delà. */
export type ContributionLevel = 0 | 1 | 2 | 3;

/** Une case de la grille : un pointage prévu et ce qui a été versé sur sa période. */
export interface ContributionCell {
  /** Début de la période, en ISO 8601 UTC (`AAAA-MM-JJ`). */
  readonly start: string;
  readonly level: ContributionLevel;
  /** Versé sur la période, en FCFA entiers. */
  readonly amount: bigint;
}

/** Assiduité d'une carte sur toute sa durée. */
export interface CardContributions {
  readonly cells: readonly ContributionCell[];
  /** Périodes réglées au moins en entier. */
  readonly regular: number;
  readonly total: number;
}

/**
 * Intensité d'une période selon le montant versé face au pointage attendu.
 * @param amount Versé sur la période.
 * @param marker Montant d'un pointage.
 * @returns L'intensité de la case.
 */
function levelOf(amount: bigint, marker: bigint): ContributionLevel {
  if (amount <= 0n) return 0;
  if (amount < marker) return 1;
  return amount < marker * 2n ? 2 : 3;
}

/**
 * Additionne les pointages faits dans une période `[start, end)`.
 * @param card Carte concernée.
 * @param start Début inclus.
 * @param end Fin exclue.
 * @returns Le montant versé.
 */
function paidBetween(card: SavingsCard, start: string, end: string): bigint {
  return card.entries
    .filter((entry) => entry.at.slice(0, 10) >= start && entry.at.slice(0, 10) < end)
    .reduce((total, entry) => total + entry.amount, 0n);
}

/**
 * Grille d'assiduité d'une carte, comme le calendrier des contributions de
 * GitHub : une case par pointage prévu, plus foncée quand la période est
 * réglée, vide quand elle a été manquée.
 * @param card Carte de pointage.
 * @returns Les cases et le nombre de périodes réglées.
 */
export function cardContributions(card: SavingsCard): CardContributions {
  const plan = { frequency: card.frequency, start: card.startDate };
  const cells = Array.from({ length: card.markersTotal }, (_, index) => {
    const start = markerStart(plan, index);
    const amount = paidBetween(card, start, markerStart(plan, index + 1));
    return { start, amount, level: levelOf(amount, card.markerAmount) };
  });
  const regular = cells.filter((cell) => cell.level >= 2).length;
  return { cells, regular, total: cells.length };
}

/**
 * Indique si l'échéance de la carte est passée.
 * @param card Carte concernée.
 * @param today Jour de référence, en ISO 8601 UTC (`AAAA-MM-JJ`).
 * @returns `true` à partir du lendemain de l'échéance.
 */
export function isPastDeadline(card: SavingsCard, today: string): boolean {
  return today > card.deadline;
}

/**
 * Libellé d'une case pour les lecteurs d'écran.
 * @param cell Case de la grille.
 * @returns Par exemple « Pointage du 12 janvier 2026 : rien versé ».
 */
export function contributionLabel(cell: ContributionCell): string {
  const paid = cell.amount > 0n ? `${formatAmount(cell.amount)} FCFA versés` : "rien versé";
  return `Pointage du ${formatLongDate(cell.start)} : ${paid}`;
}

/**
 * Résumé de l'assiduité, accordé au nombre.
 * @param contributions Assiduité de la carte.
 * @returns Par exemple « 3 pointages réglés sur 4 ».
 */
export function contributionSummary(contributions: CardContributions): string {
  const { regular, total } = contributions;
  return `${regular} ${regular > 1 ? "pointages réglés" : "pointage réglé"} sur ${total}`;
}
