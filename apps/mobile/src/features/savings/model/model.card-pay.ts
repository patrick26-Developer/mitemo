import { markerFee } from "../../../shared/member/model.contribution-fee";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { markersDone } from "../../../shared/member/model.portfolio";
import { feeRows } from "../../../shared/model/model.fee-rows";
import type { MobilePayRequest } from "../../payments";

/**
 * Décrit le prochain pointage d'une carte pour la feuille de paiement : la
 * carte, le rang du pointage, son montant et sa part des frais de la carte,
 * à la couleur de la carte.
 * @param card Carte à pointer.
 * @returns La demande de paiement du pointage, frais compris.
 */
export function cardPayRequest(card: SavingsCard): MobilePayRequest {
  const done = markersDone(card);
  const { rows, total } = feeRows("Pointage du jour", card.markerAmount, markerFee(card, done));

  return {
    title: "Pointer",
    recapTitle: "Pointage",
    rows: [
      { label: "Carte", value: card.name },
      { label: "Pointage", value: `${done + 1} sur ${card.markersTotal}` },
      ...rows,
    ],
    amount: total,
    accent: card.tint,
  };
}
