import { formatAmount } from "../../../shared/format/format.amount";
import { formatLongDate } from "../../../shared/format/format.date";
import type { SavingsCard, Tontine } from "../../../shared/member/model.portfolio";
import { selfDue } from "../../../shared/member/model.tontine-turns";
import {
  canPayContribution,
  isTontineBeneficiary,
  remainingMarkers,
} from "../../../shared/member/model.portfolio";

/** Notification affichée dans la feuille de l'accueil. */
export interface HomeNotification {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  /** Repère court, par exemple « Tour 4 » ou une échéance. */
  readonly time: string;
}

/**
 * Construit la notification de cotisation d'un tour, une cotisation par tour
 * pris par le membre.
 * @param tontine Tontine concernée.
 * @returns La notification de cotisation à régler.
 */
function contributionNotification(tontine: Tontine): HomeNotification {
  return {
    id: `pay-${tontine.id}`,
    title: "Cotisation à régler",
    message: `${tontine.name} : ${formatAmount(selfDue(tontine))} FCFA à verser pour ce tour.`,
    time: `Tour ${tontine.round}`,
  };
}

/**
 * Construit la notification de cagnotte à retirer.
 * @param tontine Tontine concernée.
 * @returns La notification de cagnotte.
 */
function potNotification(tontine: Tontine): HomeNotification {
  return {
    id: `pot-${tontine.id}`,
    title: "Restourne à recevoir",
    message: `Vous recevez la restourne de ${tontine.name} à la fin de ce tour.`,
    time: `Tour ${tontine.round}`,
  };
}

/**
 * Déduit les notifications des tontines actives du membre.
 * @param tontines Tontines du membre.
 * @returns Les notifications de cotisation et de cagnotte.
 */
function tontineNotifications(tontines: readonly Tontine[]): readonly HomeNotification[] {
  return tontines.flatMap((tontine) => {
    if (tontine.state !== "ACTIVE") return [];
    const notifications: HomeNotification[] = [];
    if (canPayContribution(tontine)) notifications.push(contributionNotification(tontine));
    if (isTontineBeneficiary(tontine)) notifications.push(potNotification(tontine));

    return notifications;
  });
}

/**
 * Déduit les notifications des cartes de pointage actives.
 * @param cards Cartes du membre.
 * @returns Les notifications d'échéance et de marqueurs restants.
 */
function cardNotifications(cards: readonly SavingsCard[]): readonly HomeNotification[] {
  return cards
    .filter((card) => card.state === "ACTIVE")
    .map((card) => ({
      id: `card-${card.id}`,
      title: "Carte en cours",
      message: `${card.name} : ${remainingMarkers(card)} marqueurs restants sur ${card.markersTotal}.`,
      time: `Avant le ${formatLongDate(card.deadline)}`,
    }));
}

/**
 * Construit les notifications affichées sur l'accueil à partir des données
 * réelles du portefeuille, sans contenu de démonstration.
 * @param tontines Tontines du membre.
 * @param cards Cartes du membre.
 * @returns Les notifications les plus récentes, six au maximum.
 */
export function buildNotifications(
  tontines: readonly Tontine[],
  cards: readonly SavingsCard[],
): readonly HomeNotification[] {
  return [...tontineNotifications(tontines), ...cardNotifications(cards)].slice(0, 6);
}
