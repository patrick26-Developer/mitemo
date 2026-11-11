import { useState } from "react";

import type { DockAction } from "../../../shared/components/macros/dock.actions";
import { FloatDock } from "../../../shared/components/macros/dock.float";
import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { ConfirmSheetContent } from "../../../shared/components/macros/sheet.confirm";
import type { Tontine } from "../../../shared/member/model.portfolio";
import {
  canConfirmRound,
  canPayContribution,
  hasReachedQuota,
  isTontineAdmin,
} from "../../../shared/member/model.portfolio";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";

/** Confirmation affichée avant de distribuer la cagnotte d'un tour. */
const CONFIRM_ROUND: ConfirmSheetContent = {
  title: "Confirmer la restourne ?",
  message:
    "La cagnotte sera distribuée automatiquement au membre dont c'est le tour, puis le tour suivant commencera.",
  confirmLabel: "Confirmer",
};

/** Props du dock d'une tontine. */
export interface TontineDetailDockProps {
  readonly item: Tontine;
  readonly actions: TontineActionsState;
}

/**
 * Choisit l'action flottante d'une tontine : réunir les membres puis lancer la
 * tontine, confirmer la restourne quand tout le monde a versé, ou cotiser.
 * @param item Tontine affichée.
 * @param actions Actions disponibles.
 * @param askConfirm Ouverture de la confirmation de restourne.
 * @returns L'action à proposer, ou `null` quand aucune n'est possible.
 */
function primaryAction(
  item: Tontine,
  actions: TontineActionsState,
  askConfirm: () => void,
): DockAction | null {
  if (item.state === "PENDING") {
    if (!isTontineAdmin(item)) return null;
    if (!hasReachedQuota(item)) return { label: "Ajouter un membre", onPress: actions.addMember };
    return { label: "Activer la restourne", onPress: actions.start };
  }
  if (item.state !== "ACTIVE") return null;
  if (canConfirmRound(item)) return { label: "Confirmer la restourne", onPress: askConfirm };
  if (canPayContribution(item)) return { label: "Continuer", onPress: actions.contribute };

  return null;
}

/**
 * Pose l'action d'une tontine en bas de l'écran, sans fond, et la confirmation
 * de restourne. Aucun retrait ni transfert : la distribution est automatique.
 * @param props Tontine affichée et actions disponibles.
 * @returns Le dock flottant et sa confirmation.
 */
export function TontineDetailDock(props: TontineDetailDockProps) {
  const { item, actions } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <FloatDock action={primaryAction(item, actions, () => setConfirmOpen(true))} />
      <ConfirmSheet
        content={CONFIRM_ROUND}
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          actions.confirm();
        }}
      />
    </>
  );
}
