import type { SavingsCard, Tontine } from "./model.portfolio";
import { isTontineAdmin } from "./model.portfolio";
import type { PortfolioContext, PortfolioState } from "./model.portfolio-actions";
import { ForbiddenOperationError } from "./model.portfolio-error";
import { requireCard, requireTontine } from "./model.portfolio-update";

/**
 * Indique si la tontine a déjà reçu une cotisation, du tour en cours ou d'avance.
 * @param tontine Tontine concernée.
 * @returns `true` dès qu'un membre a cotisé.
 */
function hasContributions(tontine: Tontine): boolean {
  return tontine.members.some(
    (member) => member.paidCurrentRound || (member.prepaidRounds ?? 0) > 0,
  );
}

/**
 * Indique si le membre connecté peut supprimer la tontine : il l'administre,
 * elle n'est pas lancée et personne n'y a encore cotisé, pour qu'aucun argent
 * ne reste en jeu.
 * @param tontine Tontine concernée.
 * @returns `true` quand la suppression est permise.
 */
export function canDeleteTontine(tontine: Tontine): boolean {
  return isTontineAdmin(tontine) && tontine.state === "PENDING" && !hasContributions(tontine);
}

/**
 * Indique si la carte peut être supprimée : elle n'a reçu aucun pointage et
 * ne porte aucune épargne.
 * @param card Carte concernée.
 * @returns `true` quand la suppression est permise.
 */
export function canDeleteCard(card: SavingsCard): boolean {
  return card.entries.length === 0 && card.saved === 0n;
}

/**
 * Supprime une tontine que son administrateur peut encore supprimer. Les
 * membres la voient supprimée et ne peuvent plus y cotiser.
 * @param context Accès au store.
 * @param tontineId Tontine à supprimer.
 * @throws {ForbiddenOperationError} si elle est lancée ou a reçu une cotisation.
 */
function deleteTontine(context: PortfolioContext, tontineId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  if (!canDeleteTontine(tontine)) {
    throw new ForbiddenOperationError(
      "Une tontine ne peut plus être supprimée une fois lancée ou après une cotisation.",
    );
  }
  context.set((state) => ({ tontines: state.tontines.filter((item) => item.id !== tontineId) }));
}

/**
 * Retire de l'historique du membre une tontine supprimée par son administrateur.
 * @param context Accès au store.
 * @param tontineId Tontine à retirer.
 * @throws {ForbiddenOperationError} si la tontine n'a pas été supprimée.
 */
function dismissTontine(context: PortfolioContext, tontineId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  if (tontine.deletedBy === undefined) {
    throw new ForbiddenOperationError("Seule une tontine supprimée peut quitter l'historique.");
  }
  context.set((state) => ({ tontines: state.tontines.filter((item) => item.id !== tontineId) }));
}

/**
 * Supprime une carte qui n'a reçu aucun pointage.
 * @param context Accès au store.
 * @param cardId Carte à supprimer.
 * @throws {ForbiddenOperationError} si la carte a déjà été pointée.
 */
function deleteCard(context: PortfolioContext, cardId: string): void {
  if (!canDeleteCard(requireCard(context.get().cards, cardId))) {
    throw new ForbiddenOperationError("Une carte déjà pointée ne peut plus être supprimée.");
  }
  context.set((state) => ({ cards: state.cards.filter((item) => item.id !== cardId) }));
}

/**
 * Actions de suppression des tontines et des cartes.
 * @param context Accès au store.
 * @returns Les actions branchées sur le store.
 */
export function removalActions(
  context: PortfolioContext,
): Pick<PortfolioState, "deleteTontine" | "dismissTontine" | "deleteCard"> {
  return {
    deleteTontine: (id) => deleteTontine(context, id),
    dismissTontine: (id) => dismissTontine(context, id),
    deleteCard: (id) => deleteCard(context, id),
  };
}
