import { Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/theme.palette";

/** Contour gris des rangs ordinaires de la frise. */
const IDLE_BORDER = "rgba(190, 196, 214, 0.9)";

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
 * le numéro dans un cercle sans fond, grisé, puis un trait vers le rang
 * suivant. Seul le rang du tour en cours prend la couleur de la tontine, sur
 * son contour et son numéro, pour rester discret à côté des lignes de membres.
 * @param props Rang, position dans la frise et couleur éventuelle.
 * @returns Le rang et son trait.
 */
export function TurnStep(props: TurnStepProps) {
  const { turn, last, accent } = props;
  const color = accent ?? IDLE_BORDER;

  return (
    <View className="w-8 items-center self-stretch">
      <View
        accessibilityLabel={`Tour ${turn}`}
        className="mt-3 size-8 items-center justify-center rounded-full border-[1.5px]"
        style={{ backgroundColor: "transparent", borderColor: color }}
      >
        <Text
          className={`text-[13px] font-semibold ${accent === undefined ? "opacity-60" : ""}`}
          style={{ color: accent ?? PALETTE.muted }}
        >
          {turn}
        </Text>
      </View>
      {last ? null : <View testID="turn-connector" className="w-px flex-1 bg-card-border" />}
    </View>
  );
}
