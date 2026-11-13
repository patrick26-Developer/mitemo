import { contributionFee } from "../../../shared/member/model.contribution-fee";
import { chargeRow } from "../../../shared/model/model.charge";
import type { Tontine } from "../../../shared/member/model.portfolio";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { MobilePaySheet } from "../../payments";
import type { MobilePayRequest } from "../../payments";
import { selfDue } from "../../../shared/member/model.tontine-turns";
import { payingRound } from "../../../shared/member/model.tontine-prepay";

/** Props de la feuille de paiement d'une cotisation. */
export interface TontinePaySheetProps {
  readonly visible: boolean;
  readonly item: Tontine;
  readonly onClose: () => void;
  /** Règle la cotisation par le moyen choisi, une fois le code reconnu. */
  readonly onPay: (method: PaymentMethod) => void;
}

/**
 * Décrit la cotisation du tour à payer, le tour en cours ou le suivant quand
 * le membre cotise d'avance : un seul montant, sa part des frais comprise.
 * @param item Tontine concernée.
 * @returns La demande de paiement de la cotisation.
 */
function contributionRequest(item: Tontine): MobilePayRequest {
  const due = selfDue(item);
  const { row, total } = chargeRow("À régler", due, contributionFee(due));

  return {
    title: "Cotiser",
    recapTitle: "Cotisation",
    rows: [
      { label: "Tontine", value: item.name },
      { label: "Tour", value: `${payingRound(item)} sur ${item.totalRounds}` },
      row,
    ],
    amount: total,
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
