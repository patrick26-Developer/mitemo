import { useState } from "react";
import type { LayoutChangeEvent } from "react-native";

import { ActionsDock } from "../../../shared/components/macros/dock.actions";
import type { DockAction } from "../../../shared/components/macros/dock.actions";
import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardCapabilities } from "../../../shared/member/model.portfolio";
import { MobilePaySheet, PayoutSheet } from "../../payments";
import type { SavingsActionsState } from "../hooks/hook.savings-actions";
import { cardPayRequest } from "../model/model.card-pay";
import { cardPayoutRequest } from "../model/model.card-payout";

/** Props du dock d'une carte de pointage. */
export interface SavingsDetailDockProps {
  readonly item: SavingsCard;
  readonly actions: SavingsActionsState;
  /** Mesure du dock, pour que le contenu réserve sa hauteur réelle. */
  readonly onLayout: (event: LayoutChangeEvent) => void;
  /** Ouvre d'emblée le pointage, demandé par une notification. */
  readonly initialPay?: boolean;
}

/**
 * Construit l'action « Pointer », à la teinte de la carte, quand un marqueur
 * peut encore être ajouté.
 * @param item Carte affichée.
 * @param onPress Ouverture de la feuille de paiement.
 * @returns L'action principale du dock, ou `null`.
 */
function pointAction(item: SavingsCard, onPress: () => void): DockAction | null {
  if (!cardCapabilities(item).canContribute) return null;

  return { label: `Pointer ${formatAmount(item.markerAmount)} FCFA`, onPress, accent: item.tint };
}

/**
 * Pose les actions d'une carte en bas de l'écran, sans fond : pointer un
 * marqueur, payé par MTN ou Airtel puis code PIN, et retirer l'épargne après
 * confirmation une fois l'objectif atteint.
 * @param props Carte affichée et actions disponibles.
 * @returns Le dock, la feuille de paiement et la confirmation.
 */
export function SavingsDetailDock(props: SavingsDetailDockProps) {
  const { item, actions, onLayout, initialPay = false } = props;
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(() => initialPay && cardCapabilities(item).canContribute);
  const { canWithdraw } = cardCapabilities(item);

  return (
    <>
      <ActionsDock
        primary={pointAction(item, () => setPayOpen(true))}
        secondary={
          canWithdraw
            ? { label: "Retirer", onPress: () => setPayoutOpen(true), accent: item.tint }
            : null
        }
        onLayout={onLayout}
      />
      <MobilePaySheet
        visible={payOpen}
        request={cardPayRequest(item)}
        onClose={() => setPayOpen(false)}
        onPay={actions.contribute}
      />
      <PayoutSheet
        visible={payoutOpen}
        request={cardPayoutRequest(item)}
        onClose={() => setPayoutOpen(false)}
        onPayout={actions.withdraw}
      />
    </>
  );
}
