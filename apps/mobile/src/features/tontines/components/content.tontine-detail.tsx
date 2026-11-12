import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { useDockInset } from "../../../shared/hooks/hook.dock-inset";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { useTontineActions } from "../hooks/hook.tontine-actions";
import { TontineRecapCard } from "./card.tontine-recap";
import { TontineDetailDock } from "./dock.tontine-detail";
import { TontineDetailHeader } from "./header.tontine-detail";
import { TontineMemberList } from "./list.tontine-members";
import { MemberAddSheet } from "./sheet.member-add";

/** Props du contenu d'une tontine trouvée. */
export interface TontineDetailContentProps {
  readonly item: Tontine;
}

/**
 * Affiche l'en-tête et ses actions rapides, la carte récapitulative et les
 * membres d'une tontine, sur le modèle du détail d'une carte de pointage. Les
 * actions du tour vivent dans le dock, qui reste visible pendant le défilement.
 * @param props Tontine à afficher.
 * @returns Le contenu détaillé de la tontine.
 */
export function TontineDetailContent(props: TontineDetailContentProps) {
  const { item } = props;
  const inset = useDockInset();
  const actions = useTontineActions(item);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <View className="flex-1">
      <TontineDetailHeader
        item={item}
        onShare={actions.share}
        onAddMember={() => setAddOpen(true)}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-4 pt-5"
        contentContainerStyle={{ paddingBottom: inset.paddingBottom }}
      >
        <TontineRecapCard item={item} />
        <TontineMemberList
          item={item}
          onRemove={actions.remove}
          onCancelInvitation={actions.cancelInvitation}
        />
        <Text className="text-[14px] leading-6 text-muted">{item.description}</Text>
      </ScrollView>
      <TontineDetailDock item={item} actions={actions} onLayout={inset.onDockLayout} />
      <MemberAddSheet
        visible={addOpen}
        item={item}
        onClose={() => setAddOpen(false)}
        onAdd={actions.invite}
        onShare={actions.share}
      />
    </View>
  );
}
