import { Text, View } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";
import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardCapabilities } from "../../../shared/member/model.portfolio";

/** Props des actions d'une carte de pointage. */
export interface SavingsActionsPanelProps {
  readonly item: SavingsCard;
  readonly onContribute: () => void;
  readonly onWithdraw: () => void;
  readonly onTransfer: () => void;
}

/**
 * Affiche les actions possibles sur la carte : ajouter un marqueur, retirer
 * l'épargne et régler la cotisation de la tontine rattachée.
 * @param props Carte affichée et actions.
 * @returns Le panneau d'actions.
 */
export function SavingsActionsPanel(props: SavingsActionsPanelProps) {
  const { item, onContribute, onWithdraw, onTransfer } = props;
  const { canContribute, canWithdraw, canTransfer } = cardCapabilities(item);

  return (
    <View className="gap-2">
      <Text className="text-[16px] font-medium text-ink">Actions</Text>
      {canContribute ? (
        <SheetPrimaryButton
          label={`Ajouter un marqueur (${formatAmount(item.markerAmount)} FCFA)`}
          onPress={onContribute}
        />
      ) : null}
      {canTransfer ? (
        <SheetPrimaryButton label="Régler la cotisation de la tontine" onPress={onTransfer} />
      ) : null}
      {canWithdraw ? <SheetSecondaryButton label="Retirer l'épargne" onPress={onWithdraw} /> : null}
    </View>
  );
}
