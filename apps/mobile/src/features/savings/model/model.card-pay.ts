import { markerFee } from "../../../shared/member/model.contribution-fee";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { markersDone } from "../../../shared/member/model.portfolio";
import { chargeRow } from "../../../shared/model/model.charge";
import type { MobilePayRequest } from "../../payments";

/**
 * Décrit le prochain pointage d'une carte pour la feuille de paiement : la
 * carte, le rang du pointage et le montant à régler, sa part des frais de la
 * carte comprise sans ligne à part, à la couleur de la carte.
 * @param card Carte à pointer.
 * @returns La demande de paiement du pointage, frais compris.
 */
export function cardPayRequest(card: SavingsCard): MobilePayRequest {
  const done = markersDone(card);
  const { row, total } = chargeRow("À régler", card.markerAmount, markerFee(card, done));

  return {
    title: "Pointer",
    recapTitle: "Pointage",
    rows: [
      { label: "Carte", value: card.name },
      { label: "Pointage", value: `${done + 1} sur ${card.markersTotal}` },
      row,
    ],
    amount: total,
    accent: card.tint,
  };
}

/**
 * Montant réellement prélevé au prochain pointage : le pointage et sa part
 * des frais de la carte, affiché tel quel sur le bouton « Pointer ».
 * @param card Carte à pointer.
 * @returns Le montant prélevé, en plus petite unité de la devise.
 */
export function markerCharge(card: SavingsCard): bigint {
  return card.markerAmount + markerFee(card, markersDone(card));
}
