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
  isTontineAdmin,
} from "../../../shared/member/model.portfolio";
import { formatAmount } from "../../../shared/format/format.amount";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";
import { TontinePaySheet } from "./sheet.tontine-pay";
import { freeTurns, selfDue } from "../../../shared/member/model.tontine-turns";
import { canPayAhead } from "../../../shared/member/model.tontine-prepay";

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
  /** Ouvre d'emblée la feuille « Cotiser », demandée par une notification. */
  readonly initialPay?: boolean;
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
 * quand tout le monde a versé, cotiser, ou retirer de l'historique une
 * tontine supprimée par son administrateur.
 * @param item Tontine affichée.
 * @param handlers Actions disponibles et ouverture des feuilles.
 * @returns L'action à proposer, ou `null` quand aucune n'est possible.
 */
function primaryAction(item: Tontine, handlers: DockHandlers): DockAction | null {
  const { actions, askConfirm, askPay } = handlers;
  if (item.deletedBy !== undefined) {
    return { label: "Retirer de l'historique", onPress: actions.dismiss };
  }
  if (item.state === "PENDING") return pendingAction(item, actions);
  if (item.state !== "ACTIVE") return null;
  if (canConfirmRound(item)) return { label: "Confirmer la restourne", onPress: askConfirm };

  return payAction(item, askPay);
}

/**
 * Action d'une tontine à lancer : tant qu'il manque des membres, « Cotiser »
 * reste visible mais grisé avec l'attente ; une fois complète,
 * l'administrateur active la restourne.
 * @param item Tontine à lancer.
 * @param actions Actions de la tontine.
 * @returns L'action, ou `null` pour un simple membre d'une tontine complète.
 */
function pendingAction(item: Tontine, actions: TontineActionsState): DockAction | null {
  const missing = freeTurns(item);
  if (missing > 0) {
    const label = `En attente de ${missing} ${missing > 1 ? "membres" : "membre"}`;
    return { label, onPress: () => undefined, tone: "disabled" };
  }
  return isTontineAdmin(item) ? { label: "Activer la restourne", onPress: actions.start } : null;
}

/**
 * Propose de cotiser le tour en cours, ou le tour suivant d'avance une fois
 * le tour réglé, tant que le total (cotisation × tours) n'est pas atteint.
 * @param item Tontine affichée.
 * @param askPay Ouvre la feuille de paiement.
 * @returns L'action de cotisation, ou `null` quand tout est déjà versé.
 */
function payAction(item: Tontine, askPay: () => void): DockAction | null {
  const amount = `${formatAmount(selfDue(item))} FCFA`;
  if (canPayContribution(item)) return { label: `Cotiser ${amount}`, onPress: askPay };
  if (canPayAhead(item)) return { label: `Cotiser d'avance ${amount}`, onPress: askPay };

  return null;
}

/**
 * Teinte l'action de la couleur de la tontine, comme sur le détail d'une carte.
 * @param action Action à proposer, ou `null`.
 * @param item Tontine affichée.
 * @returns L'action teintée, ou `null`.
 */
function tinted(action: DockAction | null, item: Tontine): DockAction | null {
  if (action === null || action.tone === "disabled") return action;
  return { ...action, accent: item.headerColors[0] };
}

/**
 * Pose l'action d'une tontine en bas de l'écran, sans fond, la feuille de
 * paiement de la cotisation et la confirmation de restourne. Aucun retrait ni transfert : la distribution est automatique.
 * @param props Tontine affichée et actions disponibles.
 * @returns Le dock flottant et sa confirmation.
 */
export function TontineDetailDock(props: TontineDetailDockProps) {
  const { item, actions, onLayout, initialPay = false } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(
    () => initialPay && payAction(item, () => undefined) !== null,
  );
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
