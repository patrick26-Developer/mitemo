import { useState } from "react";

import { ActionsDock } from "../../../shared/components/macros/dock.actions";
import type { DockAction } from "../../../shared/components/macros/dock.actions";
import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { ConfirmSheetContent } from "../../../shared/components/macros/sheet.confirm";
import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { canPayContribution, isTontineBeneficiary } from "../../../shared/member/model.portfolio";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";
import { TontineTransferSheet } from "./sheet.tontine-transfer";

/** Confirmation affichée avant de recevoir la cagnotte d'un tour. */
const WITHDRAW_CONFIRM: ConfirmSheetContent = {
  title: "Recevoir la cagnotte ?",
  message:
    "La cagnotte du tour sera versée sur votre solde disponible et le tour passera au suivant.",
  confirmLabel: "Recevoir",
};

/** Props du dock d'une tontine. */
export interface TontineDetailDockProps {
  readonly item: Tontine;
  readonly actions: TontineActionsState;
}

/**
 * Choisit l'action principale d'une tontine : recevoir la cagnotte quand le
 * membre en est le bénéficiaire, cotiser quand sa part du tour est due.
 * @param item Tontine affichée.
 * @param onContribute Action de cotisation.
 * @param onWithdraw Ouverture de la confirmation de réception.
 * @returns L'action principale, ou `null` quand aucune n'est possible.
 */
function primaryAction(
  item: Tontine,
  onContribute: () => void,
  onWithdraw: () => void,
): DockAction | null {
  if (item.state !== "ACTIVE") return null;
  if (isTontineBeneficiary(item)) return { label: "Retirer la cagnotte", onPress: onWithdraw };
  if (!canPayContribution(item)) return null;

  return { label: `Cotiser ${formatAmount(item.contribution)} FCFA`, onPress: onContribute };
}

/**
 * Pose les actions d'une tontine dans le dock de l'écran, avec la confirmation
 * de réception de la cagnotte et la feuille de transfert à un membre.
 * @param props Tontine affichée et actions disponibles.
 * @returns Le dock et ses feuilles.
 */
export function TontineDetailDock(props: TontineDetailDockProps) {
  const { item, actions } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const confirmWithdraw = () => {
    setConfirmOpen(false);
    actions.withdraw();
  };

  return (
    <>
      <ActionsDock
        primary={primaryAction(item, actions.contribute, () => setConfirmOpen(true))}
        secondary={{ label: "Transférer", onPress: () => setTransferOpen(true) }}
        notice={actions.feedback}
      />
      <ConfirmSheet
        content={WITHDRAW_CONFIRM}
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmWithdraw}
      />
      <TontineTransferSheet
        visible={transferOpen}
        item={item}
        onClose={() => setTransferOpen(false)}
        onTransfer={actions.transfer}
      />
    </>
  );
}
