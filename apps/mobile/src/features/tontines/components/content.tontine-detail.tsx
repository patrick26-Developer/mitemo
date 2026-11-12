import { useState } from "react";
import { View } from "react-native";

import { useDockInset } from "../../../shared/hooks/hook.dock-inset";
import type { DetailFocus } from "../../../shared/model/model.detail-focus";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { useTontineActions } from "../hooks/hook.tontine-actions";
import { TontineDetailBody } from "./body.tontine-detail";
import { TontineDetailDock } from "./dock.tontine-detail";
import { TontineDetailHeader } from "./header.tontine-detail";
import { MemberAddSheet } from "./sheet.member-add";

/** Props du contenu d'une tontine trouvée. */
export interface TontineDetailContentProps {
  readonly item: Tontine;
  /** Endroit à ouvrir : la feuille « Cotiser », ou la fiche d'un membre. */
  readonly focus: DetailFocus;
}

/**
 * Affiche l'en-tête et ses actions rapides, la carte récapitulative et les
 * membres d'une tontine, sur le modèle du détail d'une carte de pointage. Les
 * actions du tour vivent dans le dock, qui reste visible pendant le défilement.
 * Une notification peut l'ouvrir sur la feuille « Cotiser », ou défiler
 * jusqu'aux membres et ouvrir la fiche de l'un d'eux.
 * @param props Tontine à afficher et endroit à ouvrir.
 * @returns Le contenu détaillé de la tontine.
 */
export function TontineDetailContent(props: TontineDetailContentProps) {
  const { item, focus } = props;
  const inset = useDockInset();
  const actions = useTontineActions(item);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <View className="flex-1">
      <TontineDetailHeader item={item} onAddMember={() => setAddOpen(true)} />
      <TontineDetailBody
        item={item}
        actions={actions}
        focusMemberId={focus.memberId}
        paddingBottom={inset.paddingBottom}
      />
      <TontineDetailDock
        item={item}
        actions={actions}
        onLayout={inset.onDockLayout}
        initialPay={focus.pay}
      />
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
