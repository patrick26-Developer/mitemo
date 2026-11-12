import { useState } from "react";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { formatAmount } from "../../../shared/format/format.amount";
import { usePortfolioFeedback } from "../../../shared/hooks/hook.portfolio-feedback";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { paymentMethodName } from "../../../shared/model/model.payment-method";
import type { WithdrawMethod } from "../model/model.withdraw";
import { parseWithdrawAmount } from "../model/model.withdraw";

/** Retrait validé, en attente du code PIN. */
interface PendingWithdraw {
  readonly amount: bigint;
  readonly method: WithdrawMethod;
}

/** Saisie en cours : montant tapé et retrait en attente du code. */
interface WithdrawDraft {
  readonly amount: string;
  readonly pending: PendingWithdraw | null;
}

/** Saisie vide, à l'ouverture comme après un retrait. */
const EMPTY_DRAFT: WithdrawDraft = { amount: "", pending: null };

/** État de la feuille de retrait. */
export interface WithdrawState {
  readonly amount: string;
  readonly setAmount: (text: string) => void;
  /** Retrait en attente du code PIN, ou `null` tant que le montant est en saisie. */
  readonly pending: PendingWithdraw | null;
  readonly choose: (method: WithdrawMethod) => void;
  readonly confirm: () => void;
  /** Revient du code PIN à la saisie, montant gardé. */
  readonly back: () => void;
  readonly close: () => void;
}

/**
 * Message de succès d'un retrait.
 * @param pending Retrait confirmé.
 * @returns Par exemple « Retrait de 5 000 FCFA vers MTN MoMo lancé. ».
 */
function withdrawDone(pending: PendingWithdraw): string {
  return `Retrait de ${formatAmount(pending.amount)} FCFA vers ${paymentMethodName(pending.method)} lancé.`;
}

/**
 * Débite le retrait confirmé par le code PIN, puis ferme la feuille.
 * @param pending Retrait en attente, ou `null`.
 * @param run Exécution avec retour au membre.
 * @param close Fermeture de la feuille, après un retrait réussi.
 */
function confirmWithdraw(
  pending: PendingWithdraw | null,
  run: ReturnType<typeof usePortfolioFeedback>["run"],
  close: () => void,
): void {
  if (pending === null) return;
  const withdraw = () => usePortfolioStore.getState().withdrawAvailable(pending.amount);
  if (run(withdraw, withdrawDone(pending))) close();
}

/**
 * Retrait du solde disponible : saisie du montant, choix de l'opérateur,
 * puis code PIN avant tout débit.
 * @param onClose Ferme la feuille.
 * @returns La saisie, l'attente du code et les commandes.
 */
export function useWithdraw(onClose: () => void): WithdrawState {
  const [draft, setDraft] = useState<WithdrawDraft>(EMPTY_DRAFT);
  const show = useToastStore((state) => state.show);
  const { run } = usePortfolioFeedback();
  const { amount, pending } = draft;
  const close = () => {
    setDraft(EMPTY_DRAFT);
    onClose();
  };
  const choose = (method: WithdrawMethod) => {
    const parsed = parseWithdrawAmount(amount, usePortfolioStore.getState().available);
    if (!parsed.ok) return show("error", parsed.message);
    return setDraft({ amount, pending: { amount: parsed.value, method } });
  };
  const confirm = () => confirmWithdraw(pending, run, close);
  const setAmount = (text: string) => setDraft({ amount: text, pending: null });

  return { amount, setAmount, pending, choose, confirm, back: () => setAmount(amount), close };
}
