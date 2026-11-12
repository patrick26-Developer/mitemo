import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { MobilePaySheet } from "../../payments";
import type { MobilePayRequest } from "../../payments";
import { selfDue } from "../../../shared/member/model.tontine-turns";

/** Props de la feuille de paiement d'une cotisation. */
export interface TontinePaySheetProps {
  readonly visible: boolean;
  readonly item: Tontine;
  readonly onClose: () => void;
  /** Règle la cotisation par le moyen choisi, une fois le code reconnu. */
  readonly onPay: (method: PaymentMethod) => void;
}

/**
 * Décrit la cotisation du tour à payer.
 * @param item Tontine concernée.
 * @returns La demande de paiement de la cotisation.
 */
function contributionRequest(item: Tontine): MobilePayRequest {
  return {
    title: "Cotiser",
    recapTitle: "Cotisation",
    rows: [
      { label: "Tontine", value: item.name },
      { label: "Tour", value: `${item.round} sur ${item.totalRounds}` },
      { label: "Montant", value: `${formatAmount(selfDue(item))} FCFA` },
    ],
    amount: selfDue(item),
    accent: item.headerColors[0],
  };
}

/**
 * Fait payer la cotisation du tour par Mobile Money ou Airtel Money, puis code
 * PIN Mitemo ; la tontine se met à jour dès la confirmation.
 * @param props Visibilité, tontine, fermeture et paiement.
 * @returns La feuille « Cotiser ».
 */
export function TontinePaySheet(props: TontinePaySheetProps) {
  const { visible, item, onClose, onPay } = props;

  return (
    <MobilePaySheet
      visible={visible}
      request={contributionRequest(item)}
      onClose={onClose}
      onPay={onPay}
    />
  );
}
