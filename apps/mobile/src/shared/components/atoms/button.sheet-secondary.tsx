import { Pressable, Text } from "react-native";

import { accentColors } from "../../model/model.accent-color";

/** Props d'un bouton secondaire de feuille. */
export interface SheetSecondaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  /** Libellé annoncé aux lecteurs d'écran, quand il diffère du texte visible. */
  readonly accessibilityLabel?: string;
  /** Couleur d'action de l'écran : la bordure en prend la nuance foncée. */
  readonly accent?: string;
}

/**
 * Affiche l'action secondaire d'une feuille, en contour seulement : bordure
 * grise par défaut, ou à la couleur d'action de l'écran.
 * @param props Libellé, action, libellé d'accessibilité et couleur d'action.
 * @returns Le bouton secondaire.
 */
export function SheetSecondaryButton(props: SheetSecondaryButtonProps) {
  const { label, onPress, accessibilityLabel = label, accent } = props;
  const border =
    accent === undefined ? undefined : { borderColor: accentColors(accent).background };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="rounded-[16px] border-[1.5px] border-card-border bg-white py-4.5"
      style={border}
    >
      <Text className="text-center text-[15px] font-medium text-ink">{label}</Text>
    </Pressable>
  );
}
