import { cardCreationFee } from "./model.card-fee";
import { cardTintFor } from "./model.card-tint";
import type { SavingsCard } from "./model.portfolio";
import type { PortfolioContext, PortfolioState } from "./model.portfolio-actions";
import { ForbiddenOperationError } from "./model.portfolio-error";
import { requireCard } from "./model.portfolio-update";

/** Modification d'une carte de pointage. */
export interface CardEdit {
  readonly name: string;
  /** Objectif, en plus petite unité de la devise. */
  readonly goal: bigint;
  /** Montant d'un pointage, en plus petite unité de la devise. */
  readonly markerAmount: bigint;
}

/**
 * Indique si l'objectif et le pointage peuvent encore changer : seulement
 * avant le premier pointage, quand aucun argent n'est engagé.
 * @param card Carte concernée.
 * @returns `true` tant que la carte n'a reçu aucun pointage.
 */
export function canEditCardAmounts(card: SavingsCard): boolean {
  return card.entries.length === 0 && card.saved === 0n;
}

/**
 * Applique une modification : le nom change toujours ; l'objectif et le
 * pointage seulement avant le premier pointage, avec la couleur (le niveau)
 * et les frais qui en découlent.
 * @param card Carte à modifier.
 * @param edit Modification demandée, déjà validée.
 * @returns La carte modifiée.
 * @throws {ForbiddenOperationError} si les montants changent après le premier pointage.
 */
function applyCardEdit(card: SavingsCard, edit: CardEdit): SavingsCard {
  const amountsChange = edit.goal !== card.goal || edit.markerAmount !== card.markerAmount;
  if (amountsChange && !canEditCardAmounts(card)) {
    throw new ForbiddenOperationError("Les montants ne changent plus après le premier pointage.");
  }

  return {
    ...card,
    ...edit,
    tint: cardTintFor(edit.markerAmount),
    fee: cardCreationFee(edit.goal),
  };
}

/**
 * Construit la modification des cartes autour du store.
 * @param context Accès au store.
 * @returns L'action de modification.
 */
export function cardEditActions(context: PortfolioContext): Pick<PortfolioState, "updateCard"> {
  return {
    updateCard: (cardId, edit) => {
      const updated = applyCardEdit(requireCard(context.get().cards, cardId), edit);
      context.set((state) => ({
        cards: state.cards.map((item) => (item.id === cardId ? updated : item)),
      }));
    },
  };
}
