import { ScrollView, Text, View } from "react-native";

import { useScrollToTarget } from "../../../shared/hooks/hook.scroll-to-target";
import type { Tontine } from "../../../shared/member/model.portfolio";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";
import { TontineRecapCard } from "./card.tontine-recap";
import { TontineMemberList } from "./list.tontine-members";

/** Props du corps défilant du détail d'une tontine. */
export interface TontineDetailBodyProps {
  readonly item: Tontine;
  readonly actions: TontineActionsState;
  /** Membre dont la fiche s'ouvre, après défilement jusqu'aux membres. */
  readonly focusMemberId: string | null;
  /** Marge basse qui réserve la place du dock, en points. */
  readonly paddingBottom: number;
}

/**
 * Corps défilant du détail : carte récapitulative, membres et description.
 * Quand une notification parle d'un membre, l'écran défile jusqu'aux membres
 * et ouvre sa fiche.
 * @param props Tontine, actions, membre à ouvrir et marge du dock.
 * @returns Le contenu défilant.
 */
export function TontineDetailBody(props: TontineDetailBodyProps) {
  const { item, actions, focusMemberId, paddingBottom } = props;
  const { scrollRef, onTargetLayout } = useScrollToTarget(focusMemberId !== null);

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="gap-5 px-4 pt-5"
      contentContainerStyle={{ paddingBottom }}
    >
      <TontineRecapCard item={item} />
      <View onLayout={onTargetLayout}>
        <TontineMemberList
          item={item}
          onRemove={actions.remove}
          onCancelInvitation={actions.cancelInvitation}
          focusMemberId={focusMemberId}
        />
      </View>
      <Text className="text-[14px] leading-6 text-muted">{item.description}</Text>
    </ScrollView>
  );
}
