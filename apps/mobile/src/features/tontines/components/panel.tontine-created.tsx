import { Text, View } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetInfoCard } from "../../../shared/components/macros/card.sheet-info";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { tontineCreatedSummary } from "../model/model.tontine-created";

/** Props de la confirmation de création d'une tontine. */
export interface TontineCreatedPanelProps {
  readonly tontine: Tontine;
  /** Code créé avec la tontine. */
  readonly invitationCode: string | null;
  /** Ouvre le partage du téléphone avec le message d'invitation. */
  readonly onShare: () => void;
}

/**
 * Confirme la création d'une tontine, montre son code d'invitation et ne
 * propose qu'une action : le partager. La croix de la feuille la ferme.
 * @param props Tontine créée, code et partage.
 * @returns La confirmation de création.
 */
export function TontineCreatedPanel(props: TontineCreatedPanelProps) {
  const { tontine, invitationCode, onShare } = props;

  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text accessibilityRole="header" className="text-[20px] font-bold text-ink">
          Votre tontine est prête
        </Text>
        <Text className="text-[14px] leading-5 text-muted">{tontineCreatedSummary(tontine)}</Text>
      </View>
      {invitationCode === null ? null : (
        <SheetInfoCard>
          <Text className="text-[12px] font-semibold uppercase text-muted">
            {"Code d'invitation"}
          </Text>
          <Text
            accessibilityLabel={`Code d'invitation ${invitationCode}`}
            testID="tontine-invitation-code"
            className="text-[22px] font-bold tracking-[4px] text-ink"
          >
            {invitationCode}
          </Text>
        </SheetInfoCard>
      )}
      <SheetPrimaryButton label="Partager l'invitation" onPress={onShare} />
    </View>
  );
}
