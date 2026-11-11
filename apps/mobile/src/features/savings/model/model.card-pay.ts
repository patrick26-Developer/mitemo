import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { markersDone } from "../../../shared/member/model.portfolio";
import type { MobilePayRequest } from "../../payments";

/**
 * Décrit le prochain pointage d'une carte pour la feuille de paiement : la
 * carte, le rang du pointage et son montant, à la couleur de la carte.
 * @param card Carte à pointer.
 * @returns La demande de paiement du pointage.
 */
export function cardPayRequest(card: SavingsCard): MobilePayRequest {
  const amount = `${formatAmount(card.markerAmount)} FCFA`;

  return {
    title: "Pointer",
    recapTitle: "Pointage",
    rows: [
      { label: "Carte", value: card.name },
      { label: "Pointage", value: `${markersDone(card) + 1} sur ${card.markersTotal}` },
      { label: "Montant", value: amount },
    ],
    amount: card.markerAmount,
    accent: card.tint,
  };
}
