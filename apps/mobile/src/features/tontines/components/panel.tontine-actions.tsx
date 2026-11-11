import { Text, View } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";
import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { canPayContribution, isTontineBeneficiary } from "../../../shared/member/model.portfolio";

/** Props des actions d'une tontine. */
export interface TontineActionsPanelProps {
  readonly item: Tontine;
  readonly onContribute: () => void;
  readonly onWithdraw: () => void;
  readonly onTransfer: () => void;
}

/**
 * Affiche les actions possibles sur la tontine : cotiser, recevoir la cagnotte
 * et transférer à un membre.
 * @param props Tontine affichée et actions.
 * @returns Le panneau d'actions.
 */
export function TontineActionsPanel(props: TontineActionsPanelProps) {
  const { item, onContribute, onWithdraw, onTransfer } = props;

  return (
    <View className="gap-2">
      <Text className="text-[16px] font-medium text-ink">Actions</Text>
      {canPayContribution(item) ? (
        <SheetPrimaryButton
          label={`Cotiser ${formatAmount(item.contribution)} FCFA`}
          onPress={onContribute}
        />
      ) : null}
      {isTontineBeneficiary(item) ? (
        <SheetPrimaryButton label="Retirer la cagnotte" onPress={onWithdraw} />
      ) : null}
      <SheetSecondaryButton label="Transférer à un membre" onPress={onTransfer} />
    </View>
  );
}
