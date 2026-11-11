import { Text, View } from "react-native";

import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";
import type { Tontine } from "../../../shared/member/model.portfolio";

/** Props du panneau d'administration d'une tontine. */
export interface TontineAdminPanelProps {
  readonly item: Tontine;
  readonly onInvite: () => void;
}

/**
 * Affiche le code d'invitation et le bouton qui le crée, réservés à
 * l'administrateur de la tontine.
 * @param props Tontine administrée et action d'invitation.
 * @returns Le panneau d'administration.
 */
export function TontineAdminPanel(props: TontineAdminPanelProps) {
  const { item, onInvite } = props;
  const code = item.invitationCode;

  return (
    <View className="gap-3 rounded-[18px] border border-brand bg-brand-veil p-4">
      <Text className="text-[16px] font-medium text-ink">Administration</Text>
      <Text className="text-[13px] leading-5 text-muted">
        Partagez le code d&apos;invitation pour faire entrer un nouveau membre dans la tontine.
      </Text>
      {code === null ? null : (
        <Text className="text-[24px] font-bold tracking-widest text-ink">{code}</Text>
      )}
      <SheetSecondaryButton
        label={code === null ? "Créer un code d'invitation" : "Régénérer le code"}
        onPress={onInvite}
      />
    </View>
  );
}
