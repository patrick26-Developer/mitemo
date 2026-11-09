import { Text } from "react-native";

import { PressableScale } from "./pressable-scale";

/** Teintes proposées pour un bouton principal de feuille. */
export const SHEET_BUTTON_TONES = ["brand", "danger"] as const;

/** Teinte d'un bouton principal de feuille. Voir {@link SHEET_BUTTON_TONES}. */
export type SheetButtonTone = (typeof SHEET_BUTTON_TONES)[number];

/** Fond de chaque teinte. */
const TONE_CLASSES: Readonly<Record<SheetButtonTone, string>> = {
  brand: "bg-brand",
  danger: "bg-danger",
};

/** Props d'un bouton principal de feuille. */
export interface SheetPrimaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  /** Libellé annoncé aux lecteurs d'écran, quand il diffère du texte visible. */
  readonly accessibilityLabel?: string;
  /** Teinte du fond, bleu de marque par défaut. */
  readonly tone?: SheetButtonTone;
}

/**
 * Affiche l'action principale d'une feuille, pleine et centrée.
 * @param props Libellé, action, libellé d'accessibilité et teinte.
 * @returns Le bouton principal.
 */
export function SheetPrimaryButton(props: SheetPrimaryButtonProps) {
  const { label, onPress, accessibilityLabel = label, tone = "brand" } = props;

  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className={`rounded-[16px] ${TONE_CLASSES[tone]}`}
    >
      <Text className="py-3.5 text-center text-[15px] font-semibold text-white">{label}</Text>
    </PressableScale>
  );
}
