import type { PortfolioContext, PortfolioState } from "./model.portfolio-actions";
import { createId, SELF_MEMBER_ID } from "./model.portfolio";
import { ForbiddenOperationError } from "./model.portfolio-error";
import {
  removeTontineMember,
  requireAdmin,
  requireTontine,
  setInvitationCode,
} from "./model.portfolio-update";
import type { TontineSettings } from "./model.tontine-settings";
import { applyTontineSettings } from "./model.tontine-settings";
import { canInviteMembers } from "./model.tontine-turns";

/**
 * Code d'invitation court, lisible à voix haute.
 * @returns Le code à partager avec les futurs membres.
 */
function createInvitationCode(): string {
  return createId("invitation")
    .replace(/[^a-z0-9]/gi, "")
    .slice(-6)
    .toUpperCase();
}

/**
 * Ouvre ou renvoie le code d'invitation d'une tontine administrée.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @returns Le code d'invitation à partager.
 * @throws {ForbiddenOperationError} si la tontine est lancée ou complète.
 */
function inviteMember(context: PortfolioContext, tontineId: string): string {
  const tontine = requireTontine(context.get().tontines, tontineId);
  requireAdmin(tontine);
  if (!canInviteMembers(tontine)) {
    throw new ForbiddenOperationError("Cette tontine n'accepte plus de nouveaux membres.");
  }
  const code = tontine.invitationCode ?? createInvitationCode();
  context.set((state) => ({ tontines: setInvitationCode(state.tontines, tontineId, code) }));
  return code;
}

/**
 * Enregistre les réglages d'une tontine administrée.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @param settings Réglages validés.
 * @throws {ForbiddenOperationError} si le membre connecté n'administre pas la tontine.
 * @throws {ForbiddenOperationError} si une règle change sur une tontine lancée.
 */
function updateTontineSettings(
  context: PortfolioContext,
  tontineId: string,
  settings: TontineSettings,
): void {
  const updated = applyTontineSettings(requireTontine(context.get().tontines, tontineId), settings);
  context.set((state) => ({
    tontines: state.tontines.map((item) => (item.id === tontineId ? updated : item)),
  }));
}

/**
 * Retire un membre d'une tontine administrée.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @param memberId Membre à retirer.
 */
function removeMember(context: PortfolioContext, tontineId: string, memberId: string): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  requireAdmin(tontine);
  if (memberId === SELF_MEMBER_ID) {
    throw new ForbiddenOperationError("Vous ne pouvez pas vous retirer vous-même.");
  }
  context.set((state) => ({ tontines: removeTontineMember(state.tontines, tontineId, memberId) }));
}

/**
 * Opérations réservées à l'administrateur d'une tontine : invitation,
 * retrait d'un membre et réglages.
 * @param context Accès au store.
 * @returns Les opérations d'administration du portefeuille.
 */
export function adminActions(
  context: PortfolioContext,
): Pick<PortfolioState, "inviteMember" | "removeMember" | "updateTontineSettings"> {
  return {
    inviteMember: (id) => inviteMember(context, id),
    removeMember: (tontineId, memberId) => removeMember(context, tontineId, memberId),
    updateTontineSettings: (id, settings) => updateTontineSettings(context, id, settings),
  };
}
