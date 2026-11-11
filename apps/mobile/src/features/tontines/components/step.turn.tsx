import { Text, View } from "react-native";

import { accentColors } from "../../../shared/model/model.accent-color";

/** Props d'un rang de la frise de passage. */
export interface TurnStepProps {
  /** Rang de passage, à partir de 1. */
  readonly turn: number;
  /** Vrai pour le dernier rang, qui n'a pas de trait vers un suivant. */
  readonly last: boolean;
  /** Couleur de la tontine, présente pour le rang du tour en cours. */
  readonly accent?: string;
}

/**
 * Affiche un rang de la frise verticale de passage, [1] → [2] → … → [X] :
 * le numéro dans une pastille, puis un trait vers le rang suivant. Le rang du
 * tour en cours est rempli de la couleur de la tontine.
 * @param props Rang, position dans la frise et couleur éventuelle.
 * @returns Le rang et son trait.
 */
export function TurnStep(props: TurnStepProps) {
  const { turn, last, accent } = props;
  const colors = accent === undefined ? null : accentColors(accent);

  return (
    <View className="w-8 items-center self-stretch">
      <View
        accessibilityLabel={`Tour ${turn}`}
        className={`mt-3 size-8 items-center justify-center rounded-full border ${colors === null ? "border-card-border bg-tab-active" : ""}`}
        style={colors === null ? undefined : { backgroundColor: accent, borderColor: accent }}
      >
        <Text
          className={`text-[13px] font-bold ${colors === null ? "text-tab-ink" : ""}`}
          style={colors === null ? undefined : { color: colors.foreground }}
        >
          {turn}
        </Text>
      </View>
      {last ? null : <View testID="turn-connector" className="w-0.5 flex-1 bg-card-border" />}
    </View>
  );
}
