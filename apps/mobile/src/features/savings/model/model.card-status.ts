import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardGoal, markersDone } from "../../../shared/member/model.portfolio";

/** Statut de progression d'une carte, prêt à afficher. */
export interface CardStatus {
  /** Étape de la carte : « Pas commencée », « En cours », « Objectif atteint » ou « Retirée ». */
  readonly label: string;
  /** Pointages faits sur le total prévu, par exemple « 4 sur 6 pointages ». */
  readonly detail: string;
}

/**
 * Nomme l'étape d'une carte : retirée une fois archivée, remplie dès que
 * l'objectif est atteint, même avant sa clôture, pas commencée tant que rien n'est épargné.
 * @param card Carte concernée.
 * @returns Le libellé de l'étape.
 */
function statusLabel(card: SavingsCard): string {
  if (card.state === "ARCHIVED") return "Retirée";
  if (card.state === "COMPLETED" || card.saved >= cardGoal(card)) return "Objectif atteint";
  if (card.saved === 0n) return "Pas commencée";

  return "En cours";
}

/**
 * Résume la progression d'une carte : son étape et les pointages faits.
 * @param card Carte concernée.
 * @returns Le statut affichable.
 */
export function cardStatus(card: SavingsCard): CardStatus {
  const noun = card.markersTotal > 1 ? "pointages" : "pointage";

  return {
    label: statusLabel(card),
    detail: `${markersDone(card)} sur ${card.markersTotal} ${noun}`,
  };
}
