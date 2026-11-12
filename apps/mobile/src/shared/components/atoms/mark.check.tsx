import { Check } from "lucide-react-native";
import { View } from "react-native";

import { accentColors } from "../../model/model.accent-color";

/** Props de la coche ronde. */
export interface CheckMarkProps {
  /** Vrai quand l'étape est faite : la coche est pleine. */
  readonly done: boolean;
  /** Teinte de l'écran ; la coche prend sa nuance lisible. */
  readonly accent: string;
}

/**
 * Coche ronde d'une étape : cercle vide tant qu'elle n'est pas faite, pleine
 * et cochée ensuite (pointage d'une carte, tour d'une tontine).
 * @param props État et teinte.
 * @returns La coche.
 */
export function CheckMark(props: CheckMarkProps) {
  if (!props.done) {
    return (
      <View testID="check-mark-empty" className="size-7 rounded-full border-2 border-card-border" />
    );
  }
  const colors = accentColors(props.accent);

  return (
    <View
      testID="check-mark"
      className="size-7 items-center justify-center rounded-full"
      style={{ backgroundColor: colors.background }}
    >
      <Check size={16} color={colors.foreground} strokeWidth={3} />
    </View>
  );
}
