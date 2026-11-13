import { Pressable, Text } from "react-native";

/** Props du lien « Changer de compte ». */
export interface SwitchAccountLinkProps {
  readonly onPress: () => void;
}

/**
 * Lien discret qui ferme la session pour revenir au numéro de téléphone.
 * @param props Changement de compte.
 * @returns Le lien.
 */
export function SwitchAccountLink(props: SwitchAccountLinkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Changer de compte"
      onPress={props.onPress}
      className="min-h-11 items-center justify-center"
    >
      <Text className="text-[15px] font-semibold text-brand">Changer de compte</Text>
    </Pressable>
  );
}
