import { Text, View } from "react-native";

import { SheetInfoCard } from "../../../shared/components/macros/card.sheet-info";
import { SheetActionRow } from "../../../shared/components/macros/row.sheet-actions";
import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { formatFrequency, tontinePot } from "../../../shared/member/model.portfolio";

/** Props de la confirmation de création d'une tontine. */
export interface TontineCreatedPanelProps {
  readonly tontine: Tontine;
  /** Code à partager, `null` tant que le membre n'a pas invité. */
  readonly invitationCode: string | null;
  readonly onInvite: () => void;
  readonly onClose: () => void;
}

/**
 * Confirme la création d'une tontine et propose d'inviter les membres : la
 * feuille reste ouverte pour que le code soit partagé tout de suite.
 * @param props Tontine créée, code éventuel et actions.
 * @returns La confirmation de création.
 */
export function TontineCreatedPanel(props: TontineCreatedPanelProps) {
  const { tontine, invitationCode, onInvite, onClose } = props;

  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text accessibilityRole="header" className="text-[20px] font-bold text-ink">
          Votre tontine est prête
        </Text>
        <Text className="text-[14px] leading-5 text-muted">
          {`« ${tontine.name} » réunit ${tontine.members.length} membres sur ${tontine.totalRounds} tours, ${formatFrequency(tontine.frequency)}. Cagnotte de ${formatAmount(tontinePot(tontine))} FCFA par tour.`}
        </Text>
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
          <Text className="text-[12px] leading-4 text-muted">
            Partagez ce code avec les personnes à intégrer à la tontine.
          </Text>
        </SheetInfoCard>
      )}
      <SheetActionRow
        secondary={{ label: "Inviter un membre", onPress: onInvite }}
        primary={{ label: "Terminer", onPress: onClose }}
      />
    </View>
  );
}
