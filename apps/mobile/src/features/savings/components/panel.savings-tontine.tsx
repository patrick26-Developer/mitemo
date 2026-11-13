import { Text, View } from "react-native";

import { useOnline } from "../../../shared/hooks/hook.online";
import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";
import type { SavingsCard, Tontine } from "../../../shared/member/model.portfolio";
import { canPayContribution, cardCapabilities } from "../../../shared/member/model.portfolio";

/** Props du panneau de cotisation d'une tontine rattachée à une carte. */
export interface SavingsTontinePanelProps {
  readonly item: SavingsCard;
  readonly tontine: Tontine;
  readonly onTransfer: () => void;
}

/**
 * Propose de régler la cotisation due de la tontine rattachée avec l'épargne de
 * la carte. Le panneau disparaît quand la cotisation est déjà réglée.
 * @param props Carte affichée, tontine rattachée et action de règlement.
 * @returns Le panneau de cotisation, ou rien quand il n'y a rien à régler.
 */
export function SavingsTontinePanel(props: SavingsTontinePanelProps) {
  const { item, tontine, onTransfer } = props;

  const online = useOnline();
  if (!online || !cardCapabilities(item).canTransfer || !canPayContribution(tontine)) return null;

  return (
    <View className="gap-2 rounded-[18px] border border-card-border p-4">
      <Text className="text-[16px] font-medium text-ink">Cotisation de la tontine</Text>
      <Text className="text-[13px] leading-5 text-muted">
        {tontine.name} attend votre cotisation de ce tour. L&apos;épargne de cette carte peut la
        régler.
      </Text>
      <SheetSecondaryButton label="Régler la cotisation" onPress={onTransfer} />
    </View>
  );
}
