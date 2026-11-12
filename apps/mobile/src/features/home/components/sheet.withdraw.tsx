import { View } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { paymentMethodName } from "../../../shared/model/model.payment-method";
import { PinConfirm } from "../../auth";
import type { WithdrawState } from "../hooks/hook.withdraw";
import { useWithdraw } from "../hooks/hook.withdraw";
import { WITHDRAW_METHODS } from "../model/model.withdraw";

/** Props de la feuille de retrait. */
export interface WithdrawSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/** Props de la saisie du retrait. */
interface WithdrawFormProps {
  readonly withdraw: WithdrawState;
}

/**
 * Saisie du montant, puis un bouton par opérateur.
 * @param props État du retrait.
 * @returns Le champ et les opérateurs.
 */
function WithdrawForm(props: WithdrawFormProps) {
  const { amount, setAmount, choose } = props.withdraw;
  const available = usePortfolioStore((state) => state.available);

  return (
    <View className="gap-4">
      <SheetTextField
        label="Montant (FCFA)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        hint={`Disponible : ${formatAmount(available)} FCFA`}
      />
      {WITHDRAW_METHODS.map((method) => (
        <SheetPrimaryButton
          key={method}
          label={`Retirer vers ${paymentMethodName(method)}`}
          onPress={() => choose(method)}
        />
      ))}
    </View>
  );
}

/**
 * Retrait du solde disponible vers MTN MoMo ou Airtel Money : montant,
 * opérateur, puis code PIN Mitemo avant le débit.
 * @param props Visibilité et fermeture.
 * @returns La feuille « Retirer ».
 */
export function WithdrawSheet(props: WithdrawSheetProps) {
  const withdraw = useWithdraw(props.onClose);
  const { pending } = withdraw;
  if (pending === null) {
    return (
      <BottomSheet visible={props.visible} title="Retirer" onClose={withdraw.close}>
        <WithdrawForm withdraw={withdraw} />
      </BottomSheet>
    );
  }
  const summary = `${formatAmount(pending.amount)} FCFA vers ${paymentMethodName(pending.method)}`;

  return (
    <BottomSheet
      visible={props.visible}
      title="Retirer"
      onClose={withdraw.close}
      onBack={withdraw.back}
    >
      <SheetText>{`Saisissez votre code PIN Mitemo pour retirer ${summary}.`}</SheetText>
      <PinConfirm onConfirmed={withdraw.confirm} />
    </BottomSheet>
  );
}
