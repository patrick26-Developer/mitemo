import { ArrowRight, UserRound } from "lucide-react-native";
import { Text, View } from "react-native";

import { PressableScale } from "../../../shared/components/atoms/scale.pressable";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props de la carte qui mène au profil. */
export interface ProfileLinkCardProps {
  readonly onPress: () => void;
}

/**
 * Carte fléchée qui mène à la page profil, posée sous les informations du
 * membre à la place d'un bouton.
 * @param props Ouverture du profil.
 * @returns La carte de lien vers le profil.
 */
export function ProfileLinkCard(props: ProfileLinkCardProps) {
  return (
    <PressableScale accessibilityLabel="Voir mon profil" onPress={props.onPress}>
      <View className="flex-row items-center gap-3 rounded-[18px] border border-card-border bg-white px-4 py-3.5">
        <UserRound size={20} color={PALETTE.muted} />
        <View className="flex-1 gap-0.5">
          <Text className="text-[15px] font-semibold text-ink">Voir mon profil</Text>
          <Text className="text-[13px] text-muted">Modifier mes informations et mes réglages</Text>
        </View>
        <ArrowRight size={20} color={PALETTE.muted} />
      </View>
    </PressableScale>
  );
}
