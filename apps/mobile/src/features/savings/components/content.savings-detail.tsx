import { ScrollView, Text, View } from "react-native";

import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { useSavingsActions } from "../hooks/hook.savings-actions";
import { SavingsFactsCard } from "./card.savings-facts";
import { SavingsSummaryCard } from "./card.savings-summary";
import { SavingsDetailDock } from "./dock.savings-detail";
import { SavingsTontinePanel } from "./panel.savings-tontine";

/** Props du contenu d'une carte trouvée. */
export interface SavingsDetailContentProps {
  readonly item: SavingsCard;
}

/**
 * Affiche la synthèse, les échéances et la tontine rattachée d'une carte de
 * pointage. Les actions vivent dans le dock, qui reste visible pendant le
 * défilement.
 * @param props Carte à afficher.
 * @returns Le contenu détaillé de la carte.
 */
export function SavingsDetailContent(props: SavingsDetailContentProps) {
  const { item } = props;
  const actions = useSavingsActions(item);
  const tontine = usePortfolioStore((state) =>
    state.tontines.find((entry) => entry.id === item.tontineId),
  );

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 px-4 pb-32">
        <SavingsSummaryCard item={item} />
        <SavingsFactsCard item={item} tontineName={tontine?.name ?? null} />
        {tontine === undefined ? null : (
          <SavingsTontinePanel item={item} tontine={tontine} onTransfer={actions.transfer} />
        )}
        <Text className="text-[14px] leading-6 text-muted">{item.description}</Text>
      </ScrollView>
      <SavingsDetailDock item={item} actions={actions} />
    </View>
  );
}
