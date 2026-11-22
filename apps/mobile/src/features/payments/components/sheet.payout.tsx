import { View } from "react-native";

import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import { formatAmount } from "../../../shared/format/format.amount";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import { PAYMENT_METHODS, paymentMethodName } from "../../../shared/model/model.payment-method";
import { PinConfirm } from "../../auth";
import { usePayout } from "../hooks/hook.payout";
import { PayMethodButton } from "./button.pay-method";
import type { MobilePayRequest } from "./sheet.mobile-pay";

/** Props de la feuille de retrait. */
export interface PayoutSheetProps {
  readonly visible: boolean;
  /** Titre, récapitulatif, montant retiré et couleur d'action. */
  readonly request: MobilePayRequest;
  readonly onClose: () => void;
  /** Retire le montant vers le moyen choisi, une fois le code PIN reconnu. */
  readonly onPayout: (method: PaymentMethod) => void;
}

/** Props du choix du moyen de retrait. */
interface PayoutChoiceProps {
  readonly request: MobilePayRequest;
  readonly onChoose: (method: PaymentMethod) => void;
}

/**
 * Récapitule le retrait et propose un bouton par moyen, comme « Cotiser » :
 * « Retirer vers Mitemo » plein, les opérateurs en contour.
 * @param props Demande de retrait et choix.
 * @returns Le récapitulatif et les trois boutons.
 */
function PayoutChoice(props: PayoutChoiceProps) {
  const { request, onChoose } = props;

  return (
    <>
      <SheetRecap title={request.recapTitle} rows={request.rows} />
      <View className="gap-2.5">
        {PAYMENT_METHODS.map((method) => (
          <PayMethodButton
            key={method}
            label={`Retirer vers ${paymentMethodName(method)}`}
            filled={method === "MITEMO"}
            accent={request.accent}
            onPress={() => onChoose(method)}
          />
        ))}
      </View>
    </>
  );
}

/**
 * Fait retirer un montant : le membre choisit le solde Mitemo ou un
 * opérateur, puis saisit son code PIN. Pas de « Retour » : la croix ferme.
 * @param props Visibilité, demande de retrait, fermeture et retrait.
 * @returns La feuille de retrait.
 */
export function PayoutSheet(props: PayoutSheetProps) {
  const { request } = props;
  const payout = usePayout(props.onPayout, props.onClose);
  const { method } = payout;

  return (
    <BottomSheet visible={props.visible} title={request.title} onClose={payout.close}>
      {method === null ? (
        <PayoutChoice request={request} onChoose={payout.choose} />
      ) : (
        <>
          <SheetText>{`Saisissez votre code PIN Mitemo pour retirer ${formatAmount(request.amount)} FCFA vers ${paymentMethodName(method)}.`}</SheetText>
          <PinConfirm onConfirmed={payout.confirm} />
        </>
      )}
    </BottomSheet>
  );
}
