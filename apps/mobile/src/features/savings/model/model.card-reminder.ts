import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard, Tontine } from "../../../shared/member/model.portfolio";
import { canPayContribution } from "../../../shared/member/model.portfolio";

/** Rappel de versement d'une carte vers sa tontine, prêt à être notifié. */
export interface CardReminder {
  /** Identifiant unique par carte, tontine et tour : un rappel par tour. */
  readonly id: string;
  /** Carte à ouvrir quand le membre touche la notification. */
  readonly cardId: string;
  readonly title: string;
  readonly body: string;
}

/**
 * Construit le rappel d'une carte dont la tontine attend la cotisation.
 * @param card Carte liée.
 * @param tontine Tontine de la carte.
 * @returns Le rappel à notifier.
 */
function reminderOf(card: SavingsCard, tontine: Tontine): CardReminder {
  return {
    id: `card-${card.id}-${tontine.id}-round-${tontine.round}`,
    cardId: card.id,
    title: "Cotisation à verser",
    body: `La cotisation de ${formatAmount(tontine.contribution)} FCFA de « ${tontine.name} » est due. Versez-la depuis votre carte « ${card.name} ».`,
  };
}

/**
 * Liste les rappels à envoyer : une carte en cours, liée à une tontine dont la
 * cotisation du membre est due, demande un versement vers cette tontine.
 * @param cards Cartes du membre.
 * @param tontines Tontines du membre.
 * @returns Un rappel par carte concernée, pour le tour en cours.
 */
export function cardTransferReminders(
  cards: readonly SavingsCard[],
  tontines: readonly Tontine[],
): readonly CardReminder[] {
  return cards.flatMap((card) => {
    const tontine = tontines.find((entry) => entry.id === card.tontineId);
    if (card.state !== "ACTIVE" || tontine === undefined) return [];

    return canPayContribution(tontine) ? [reminderOf(card, tontine)] : [];
  });
}
