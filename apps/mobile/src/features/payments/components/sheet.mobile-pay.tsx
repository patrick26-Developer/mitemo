import { View } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";
import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import type { PaymentMethod } from "../../../shared/model/model.payment-method";
import {
  PAYMENT_METHODS,
  isMobileMoney,
  paymentMethodName,
} from "../../../shared/model/model.payment-method";
import { PinConfirm } from "../../auth";
import { useMobilePay } from "../hooks/hook.mobile-pay";
import { pendingInstructions } from "../model/model.pay-flow";
import { DEFAULT_PENDING_ACCENT, PayPendingStep } from "./step.pay-pending";

/** Ce qui est payé : titre de la feuille, récapitulatif et montant. */
export interface MobilePayRequest {
  /** Titre de la feuille, par exemple « Cotiser » ou « Pointer ». */
  readonly title: string;
  readonly recapTitle: string;
  readonly rows: readonly SheetRecapRow[];
  /** Montant à payer, en plus petite unité de la devise. */
  readonly amount: bigint;
  /** Couleur d'action de l'écran d'origine, bleu de marque par défaut. */
  readonly accent?: string;
}

/** Props de la feuille de paiement. */
export interface MobilePaySheetProps {
  readonly visible: boolean;
  readonly request: MobilePayRequest;
  readonly onClose: () => void;
  /** Règle le montant par le moyen choisi, une fois le paiement validé. */
  readonly onPay: (method: PaymentMethod) => void;
}

/** Props du choix du moyen de paiement. */
interface PayChoiceProps {
  readonly request: MobilePayRequest;
  readonly onChoose: (method: PaymentMethod) => void;
}

/** Props du bouton d'un moyen de paiement. */
interface PayMethodButtonProps {
  readonly method: PaymentMethod;
  readonly accent: string | undefined;
  readonly onChoose: (method: PaymentMethod) => void;
}

/**
 * Bouton « Payer avec … » : plein à la couleur d'action pour Mitemo, le moyen
 * mis en avant, en contour seulement pour les opérateurs mobiles.
 * @param props Moyen, couleur d'action et choix.
 * @returns Le bouton du moyen de paiement.
 */
function PayMethodButton(props: PayMethodButtonProps) {
  const { method, onChoose } = props;
  const label = `Payer avec ${paymentMethodName(method)}`;
  const accent = props.accent === undefined ? {} : { accent: props.accent };

  if (isMobileMoney(method)) {
    return <SheetSecondaryButton label={label} onPress={() => onChoose(method)} {...accent} />;
  }

  return <SheetPrimaryButton label={label} onPress={() => onChoose(method)} {...accent} />;
}

/**
 * Récapitule le paiement et propose un bouton par moyen : « Payer avec MTN
 * MoMo », « Payer avec Airtel Money », « Payer avec Mitemo ».
 * @param props Demande de paiement et choix.
 * @returns Le récapitulatif et les trois boutons.
 */
function PayChoice(props: PayChoiceProps) {
  const { request, onChoose } = props;

  return (
    <>
      <SheetRecap title={request.recapTitle} rows={request.rows} />
      <View className="gap-2.5">
        {PAYMENT_METHODS.map((method) => (
          <PayMethodButton
            key={method}
            method={method}
            accent={request.accent}
            onChoose={onChoose}
          />
        ))}
      </View>
    </>
  );
}

/**
 * Fait payer un montant : le membre touche le bouton de son moyen. Avec MTN
 * MoMo ou Airtel Money, la feuille explique comment valider sur le téléphone
 * et attend que le serveur confirme le paiement ; avec Mitemo, elle demande le
 * code PIN. L'opération s'applique dès la confirmation.
 * @param props Visibilité, demande de paiement, fermeture et paiement.
 * @returns La feuille de paiement.
 */
export function MobilePaySheet(props: MobilePaySheetProps) {
  const { visible, request, onClose, onPay } = props;
  const pay = useMobilePay({ amount: request.amount, onPay, onClose });
  const amount = `${formatAmount(request.amount)} FCFA`;

  return (
    <BottomSheet
      visible={visible}
      title={request.title}
      onClose={pay.close}
      {...(pay.stage === "pin" ? { onBack: pay.back } : {})}
    >
      {pay.stage === "choose" ? <PayChoice request={request} onChoose={pay.choose} /> : null}
      {pay.stage === "pending" && pay.method !== "MITEMO" ? (
        <PayPendingStep
          operator={paymentMethodName(pay.method)}
          instructions={pendingInstructions(pay.method, request.amount)}
          accent={request.accent ?? DEFAULT_PENDING_ACCENT}
        />
      ) : null}
      {pay.stage === "pin" ? (
        <>
          <SheetText>{`Saisissez votre code PIN Mitemo pour payer ${amount} depuis votre solde.`}</SheetText>
          <PinConfirm onConfirmed={pay.confirm} />
        </>
      ) : null}
    </BottomSheet>
  );
}
