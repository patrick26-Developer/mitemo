import { useState } from "react";
import type { LayoutChangeEvent } from "react-native";

import { ActionsDock } from "../../../shared/components/macros/dock.actions";
import type { DockAction } from "../../../shared/components/macros/dock.actions";
import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { ConfirmSheetContent } from "../../../shared/components/macros/sheet.confirm";
import type { Tontine } from "../../../shared/member/model.portfolio";
import {
  canConfirmRound,
  canPayContribution,
  hasReachedQuota,
  isTontineAdmin,
} from "../../../shared/member/model.portfolio";
import { formatAmount } from "../../../shared/format/format.amount";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";
import { TontinePaySheet } from "./sheet.tontine-pay";
import { selfDue } from "../../../shared/member/model.tontine-turns";

/** Confirmation affichée avant de distribuer la cagnotte d'un tour. */
const CONFIRM_ROUND: ConfirmSheetContent = {
  title: "Confirmer la restourne ?",
  message:
    "La restourne sera versée automatiquement au membre dont c'est le tour, puis le tour suivant commencera.",
  confirmLabel: "Confirmer",
};

/** Props du dock d'une tontine. */
export interface TontineDetailDockProps {
  readonly item: Tontine;
  readonly actions: TontineActionsState;
  /** Mesure du dock, pour que le contenu réserve sa hauteur réelle. */
  readonly onLayout: (event: LayoutChangeEvent) => void;
}

/** Actions de la tontine et ouverture des feuilles du dock. */
interface DockHandlers {
  readonly actions: TontineActionsState;
  readonly askConfirm: () => void;
  readonly askPay: () => void;
}

/**
 * Choisit l'action flottante d'une tontine : lancer la tontine une fois les
 * membres réunis (l'ajout se fait depuis l'en-tête), confirmer la restourne
 * quand tout le monde a versé, ou cotiser.
 * @param item Tontine affichée.
 * @param handlers Actions disponibles et ouverture des feuilles.
 * @returns L'action à proposer, ou `null` quand aucune n'est possible.
 */
function primaryAction(item: Tontine, handlers: DockHandlers): DockAction | null {
  const { actions, askConfirm, askPay } = handlers;
  if (item.state === "PENDING") {
    if (!isTontineAdmin(item) || !hasReachedQuota(item)) return null;
    return { label: "Activer la restourne", onPress: actions.start };
  }
  if (item.state !== "ACTIVE") return null;
  if (canConfirmRound(item)) return { label: "Confirmer la restourne", onPress: askConfirm };
  if (canPayContribution(item)) {
    return { label: `Cotiser ${formatAmount(selfDue(item))} FCFA`, onPress: askPay };
  }

  return null;
}

/**
 * Teinte l'action de la couleur de la tontine, comme sur le détail d'une carte.
 * @param action Action à proposer, ou `null`.
 * @param item Tontine affichée.
 * @returns L'action teintée, ou `null`.
 */
function tinted(action: DockAction | null, item: Tontine): DockAction | null {
  return action === null ? null : { ...action, accent: item.headerColors[0] };
}

/**
 * Pose l'action d'une tontine en bas de l'écran, sans fond, la feuille de
 * paiement de la cotisation et la confirmation de restourne. Aucun retrait ni transfert : la distribution est automatique.
 * @param props Tontine affichée et actions disponibles.
 * @returns Le dock flottant et sa confirmation.
 */
export function TontineDetailDock(props: TontineDetailDockProps) {
  const { item, actions, onLayout } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const handlers = {
    actions,
    askConfirm: () => setConfirmOpen(true),
    askPay: () => setPayOpen(true),
  };

  return (
    <>
      <ActionsDock primary={tinted(primaryAction(item, handlers), item)} onLayout={onLayout} />
      <TontinePaySheet
        visible={payOpen}
        item={item}
        onClose={() => setPayOpen(false)}
        onPay={actions.contribute}
      />
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
