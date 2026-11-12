import type { MobilePayRequest } from "../../payments";
import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard } from "../../../shared/member/model.portfolio";

/**
 * Prépare le retrait de l'épargne d'une carte remplie.
 * @param card Carte à retirer.
 * @returns Le titre, le récapitulatif, le montant et la teinte de la carte.
 */
export function cardPayoutRequest(card: SavingsCard): MobilePayRequest {
  return {
    title: "Retirer",
    recapTitle: "Retrait",
    rows: [
      { label: "Carte", value: card.name },
      { label: "Montant", value: `${formatAmount(card.saved)} FCFA` },
    ],
    amount: card.saved,
    accent: card.tint,
  };
}
