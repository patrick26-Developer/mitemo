import { useState } from "react";
import type { LayoutChangeEvent } from "react-native";

import { ActionsDock } from "../../../shared/components/macros/dock.actions";
import type { DockAction } from "../../../shared/components/macros/dock.actions";
import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { ConfirmSheetContent } from "../../../shared/components/macros/sheet.confirm";
import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardCapabilities } from "../../../shared/member/model.portfolio";
import { MobilePaySheet } from "../../payments";
import type { SavingsActionsState } from "../hooks/hook.savings-actions";
import { cardPayRequest } from "../model/model.card-pay";

/** Confirmation affichée avant de reverser l'épargne sur le solde. */
const WITHDRAW_CONFIRM: ConfirmSheetContent = {
  title: "Retirer l'épargne ?",
  message: "L'épargne de cette carte rejoindra votre solde disponible et la carte sera vidée.",
  confirmLabel: "Retirer l'épargne",
};

/** Props du dock d'une carte de pointage. */
export interface SavingsDetailDockProps {
  readonly item: SavingsCard;
  readonly actions: SavingsActionsState;
  /** Mesure du dock, pour que le contenu réserve sa hauteur réelle. */
  readonly onLayout: (event: LayoutChangeEvent) => void;
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
  const { item, actions, onLayout } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const { canWithdraw } = cardCapabilities(item);

  return (
    <>
      <ActionsDock
        primary={pointAction(item, () => setPayOpen(true))}
        secondary={
          canWithdraw
            ? { label: "Retirer", onPress: () => setConfirmOpen(true), accent: item.tint }
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
      <ConfirmSheet
        content={WITHDRAW_CONFIRM}
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          actions.withdraw();
        }}
      />
    </>
  );
}
