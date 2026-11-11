import { useState } from "react";

import { ActionsDock } from "../../../shared/components/macros/dock.actions";
import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { ConfirmSheetContent } from "../../../shared/components/macros/sheet.confirm";
import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardCapabilities } from "../../../shared/member/model.portfolio";
import type { SavingsActionsState } from "../hooks/hook.savings-actions";

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
}

/**
 * Pose les actions d'une carte dans le dock de l'écran : pointer un marqueur et
 * retirer l'épargne après confirmation.
 * @param props Carte affichée et actions disponibles.
 * @returns Le dock et sa confirmation.
 */
export function SavingsDetailDock(props: SavingsDetailDockProps) {
  const { item, actions } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { canContribute, canWithdraw } = cardCapabilities(item);

  const confirmWithdraw = () => {
    setConfirmOpen(false);
    actions.withdraw();
  };

  return (
    <>
      <ActionsDock
        primary={
          canContribute
            ? {
                label: `Pointer ${formatAmount(item.markerAmount)} FCFA`,
                onPress: actions.contribute,
              }
            : null
        }
        secondary={canWithdraw ? { label: "Retirer", onPress: () => setConfirmOpen(true) } : null}
        notice={actions.feedback}
      />
      <ConfirmSheet
        content={WITHDRAW_CONFIRM}
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmWithdraw}
      />
    </>
  );
}
