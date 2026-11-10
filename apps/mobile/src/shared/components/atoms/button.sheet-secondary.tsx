import { Pressable, Text } from "react-native";

/** Props d'un bouton secondaire de feuille. */
export interface SheetSecondaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  /** Libellé annoncé aux lecteurs d'écran, quand il diffère du texte visible. */
  readonly accessibilityLabel?: string;
}

/**
 * Affiche l'action secondaire d'une feuille, bordée et centrée.
 * @param props Libellé, action et libellé d'accessibilité.
 * @returns Le bouton secondaire.
 */
export function SheetSecondaryButton(props: SheetSecondaryButtonProps) {
  const { label, onPress, accessibilityLabel = label } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="rounded-[16px] border border-card-border py-3.5"
    >
      <Text className="text-center text-[15px] font-medium text-ink">{label}</Text>
    </Pressable>
  );
}
