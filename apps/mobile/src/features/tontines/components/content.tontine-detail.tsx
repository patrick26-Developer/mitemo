import { ScrollView, Text, View } from "react-native";

import { useDockInset } from "../../../shared/hooks/hook.dock-inset";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { isTontineAdmin } from "../../../shared/member/model.portfolio";
import { useTontineActions } from "../hooks/hook.tontine-actions";
import { TontineRecapCard } from "./card.tontine-recap";
import { TontineDetailDock } from "./dock.tontine-detail";
import { TontineMemberList } from "./list.tontine-members";
import { TontineAdminPanel } from "./panel.tontine-admin";

/** Props du contenu d'une tontine trouvée. */
export interface TontineDetailContentProps {
  readonly item: Tontine;
}

/**
 * Affiche la carte récapitulative et les membres d'une tontine, sur le modèle
 * du détail d'une carte de pointage. L'administrateur
 * voit en plus le code d'invitation. Les actions vivent dans le dock, qui reste
 * visible pendant le défilement.
 * @param props Tontine à afficher.
 * @returns Le contenu détaillé de la tontine.
 */
export function TontineDetailContent(props: TontineDetailContentProps) {
  const { item } = props;
  const inset = useDockInset();
  const actions = useTontineActions(item);
  const admin = isTontineAdmin(item);

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-4"
        contentContainerStyle={{ paddingBottom: inset.paddingBottom }}
      >
        <TontineRecapCard item={item} />
        {admin ? <TontineAdminPanel item={item} onInvite={actions.invite} /> : null}
        <TontineMemberList item={item} onRemove={actions.remove} />
        <Text className="text-[14px] leading-6 text-muted">{item.description}</Text>
      </ScrollView>
      <TontineDetailDock item={item} actions={actions} onLayout={inset.onDockLayout} />
    </View>
  );
}
