import { ScrollView, Text } from "react-native";

import type { DemoTontine } from "../../../shared/demo/demo.tontines";
import { TontineCycleCard } from "./card.tontine-cycle";
import { TontineSummaryCard } from "./card.tontine-summary";

/** Props du contenu d'une tontine trouvée. */
export interface TontineDetailContentProps {
  readonly item: DemoTontine;
}

/**
 * Affiche la synthèse, le cycle et la description d'une tontine.
 * @param props Tontine à afficher.
 * @returns Le contenu détaillé de la tontine.
 */
export function TontineDetailContent(props: TontineDetailContentProps) {
  const { item } = props;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 px-4 pb-8">
      <TontineSummaryCard item={item} />
      <TontineCycleCard item={item} />
      <Text className="text-[14px] leading-6 text-muted">{item.description}</Text>
    </ScrollView>
  );
}
