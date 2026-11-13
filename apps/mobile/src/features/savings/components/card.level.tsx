import { Text, View } from "react-native";

import { MascotTemo } from "../../../shared/components/atoms/mascot.temo";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardLevelText } from "../model/model.card-options";

/** Props de la carte de niveau. */
export interface CardLevelCardProps {
  readonly item: SavingsCard;
}

/**
 * Petite carte, à la couleur de la carte de pointage, où Temo explique son
 * niveau et pourquoi elle a cette couleur.
 * @param props Carte concernée.
 * @returns La carte de niveau.
 */
export function CardLevelCard(props: CardLevelCardProps) {
  const { title, body } = cardLevelText(props.item);

  return (
    <View
      testID="card-level"
      className="flex-row items-center gap-3 rounded-[18px] p-3.5"
      style={{ backgroundColor: props.item.tint }}
    >
      <MascotTemo size={64} />
      <View className="flex-1 gap-1">
        <Text className="text-[15px] font-bold text-ink">{title}</Text>
        <Text className="text-[13px] leading-[18px] text-ink/75">{body}</Text>
      </View>
    </View>
  );
}
