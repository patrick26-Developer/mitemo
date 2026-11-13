import { useState } from "react";
import { markerCharge } from "../model/model.card-pay";
import type { LayoutChangeEvent } from "react-native";

import { ActionsDock } from "../../../shared/components/macros/dock.actions";
import type { DockAction } from "../../../shared/components/macros/dock.actions";
import { ConfirmSheet } from "../../../shared/components/macros/sheet.confirm";
import type { ConfirmSheetContent } from "../../../shared/components/macros/sheet.confirm";
import { formatAmount } from "../../../shared/format/format.amount";
import type { SavingsCard } from "../../../shared/member/model.portfolio";
import { cardCapabilities } from "../../../shared/member/model.portfolio";
import { canDeleteCard } from "../../../shared/member/model.portfolio-removal";
import { MobilePaySheet, PayoutSheet } from "../../payments";
import type { SavingsActionsState } from "../hooks/hook.savings-actions";
import { cardPayRequest } from "../model/model.card-pay";
import { cardPayoutRequest } from "../model/model.card-payout";
import { withTapSound } from "../../../shared/feedback/api.tap-sound";

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
 * peut encore être ajouté, avec le montant réellement prélevé, frais compris.
 * @param item Carte affichée.
 * @param onPress Ouverture de la feuille de paiement.
 * @returns L'action principale du dock, ou `null`.
 */
function pointAction(item: SavingsCard, onPress: () => void): DockAction | null {
  if (!cardCapabilities(item).canContribute) return null;

  return {
    label: `Pointer ${formatAmount(markerCharge(item))} FCFA`,
    onPress: withTapSound("pay", onPress),
    accent: item.tint,
  };
}

/** Confirmation de la suppression d'une carte. */
const CONFIRM_DISCARD: ConfirmSheetContent = {
  title: "Supprimer la carte ?",
  message: "La carte n'a reçu aucun pointage : elle disparaît, sans argent en jeu.",
  confirmLabel: "Supprimer",
  tone: "danger",
};

/** Ouverture des feuilles de l'action secondaire. */
interface SecondaryHandlers {
  readonly withdraw: () => void;
  readonly discard: () => void;
}

/**
 * Action secondaire d'une carte : retirer l'épargne une fois l'objectif
 * atteint, ou supprimer une carte qui n'a reçu aucun pointage.
 * @param item Carte affichée.
 * @param handlers Ouverture du retrait et de la suppression.
 * @returns L'action à proposer, ou `null` quand aucune n'est possible.
 */
function secondaryAction(item: SavingsCard, handlers: SecondaryHandlers): DockAction | null {
  if (cardCapabilities(item).canWithdraw) {
    return { label: "Retirer", onPress: handlers.withdraw, accent: item.tint };
  }
  if (canDeleteCard(item)) {
    return { label: "Supprimer la carte", onPress: handlers.discard, tone: "danger" };
  }

  return null;
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
  const [discardOpen, setDiscardOpen] = useState(false);

  return (
    <>
      <ActionsDock
        primary={pointAction(item, () => setPayOpen(true))}
        secondary={secondaryAction(item, {
          withdraw: () => setPayoutOpen(true),
          discard: () => setDiscardOpen(true),
        })}
        onLayout={onLayout}
      />
      <MobilePaySheet
        visible={payOpen}
        request={cardPayRequest(item)}
        onClose={() => setPayOpen(false)}
        onPay={actions.contribute}
      />
      <ConfirmSheet
        content={CONFIRM_DISCARD}
        visible={discardOpen}
        onClose={() => setDiscardOpen(false)}
        onConfirm={() => {
          setDiscardOpen(false);
          actions.discard();
        }}
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
