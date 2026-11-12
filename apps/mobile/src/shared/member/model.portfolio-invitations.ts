import type { ReceivedInvitation } from "./model.invitation";
import type { Tontine } from "./model.portfolio";
import type { PortfolioContext } from "./model.portfolio-actions";
import type { MemberContact } from "./model.portfolio-create";
import { buildInvitation, buildJoiningSelf } from "./model.portfolio-create";
import { ForbiddenOperationError, UnknownEntityError } from "./model.portfolio-error";
import { prependTontine, requireAdmin, requireTontine } from "./model.portfolio-update";
import { freeTurns } from "./model.tontine-turns";

/**
 * Remplace une tontine par sa version modifiée.
 * @param tontines Tontines du membre.
 * @param id Tontine concernée.
 * @param change Modification à appliquer.
 * @returns La liste avec la tontine modifiée.
 */
function updateTontine(
  tontines: readonly Tontine[],
  id: string,
  change: (tontine: Tontine) => Tontine,
): readonly Tontine[] {
  return tontines.map((tontine) => (tontine.id === id ? change(tontine) : tontine));
}

/**
 * Vérifie qu'un contact peut encore être invité dans la tontine.
 * @param tontine Tontine concernée.
 * @param contact Contact à inviter.
 * @throws {ForbiddenOperationError} si la tontine est lancée, complète, ou si le contact y est déjà.
 */
function requireInvitable(tontine: Tontine, contact: MemberContact): void {
  if (tontine.state !== "PENDING") {
    throw new ForbiddenOperationError("Cette tontine est déjà lancée.");
  }
  if (freeTurns(tontine) === 0) {
    throw new ForbiddenOperationError("Tous les tours de la tontine sont déjà pris.");
  }
  const known = [...tontine.members, ...tontine.invitations];
  if (known.some((entry) => entry.phone === contact.phone)) {
    throw new ForbiddenOperationError(`${contact.name} est déjà invité ou membre.`);
  }
}

/**
 * Invite un contact titulaire d'un compte Mitemo : il ne devient membre qu'en
 * acceptant, comme pour un groupe WhatsApp où l'ajout n'est pas imposé.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @param contact Nom et numéro du contact.
 * @throws {ForbiddenOperationError} si le membre connecté n'administre pas la tontine.
 * @throws {ForbiddenOperationError} si la tontine est lancée, complète, ou si le contact y est déjà.
 */
export function inviteContact(
  context: PortfolioContext,
  tontineId: string,
  contact: MemberContact,
): void {
  const tontine = requireTontine(context.get().tontines, tontineId);
  requireAdmin(tontine);
  requireInvitable(tontine, contact);
  const invitation = buildInvitation(contact);
  context.set((state) => ({
    tontines: updateTontine(state.tontines, tontineId, (item) => ({
      ...item,
      invitations: [...item.invitations, invitation],
    })),
  }));
}

/**
 * Retire une invitation envoyée d'une tontine.
 * @param tontine Tontine concernée.
 * @param invitationId Invitation à retirer.
 * @returns La tontine sans cette invitation.
 */
function withoutInvitation(tontine: Tontine, invitationId: string): Tontine {
  return {
    ...tontine,
    invitations: tontine.invitations.filter((entry) => entry.id !== invitationId),
  };
}

/**
 * Annule une invitation envoyée qui attend encore sa réponse.
 * @param context Accès au store.
 * @param tontineId Tontine concernée.
 * @param invitationId Invitation à annuler.
 * @throws {ForbiddenOperationError} si le membre connecté n'administre pas la tontine.
 */
export function cancelInvitation(
  context: PortfolioContext,
  tontineId: string,
  invitationId: string,
): void {
  requireAdmin(requireTontine(context.get().tontines, tontineId));
  context.set((state) => ({
    tontines: updateTontine(state.tontines, tontineId, (item) =>
      withoutInvitation(item, invitationId),
    ),
  }));
}

/**
 * Retrouve une invitation reçue.
 * @param invitations Invitations reçues.
 * @param id Identifiant recherché.
 * @returns L'invitation trouvée.
 * @throws {UnknownEntityError} si elle n'existe pas ou plus.
 */
function requireInvitation(
  invitations: readonly ReceivedInvitation[],
  id: string,
): ReceivedInvitation {
  const invitation = invitations.find((entry) => entry.id === id);
  if (invitation === undefined) throw new UnknownEntityError(`Invitation inconnue : ${id}.`);

  return invitation;
}

/**
 * Vérifie que le nombre de tours demandé tient dans les tours libres.
 * @param tontine Tontine rejointe.
 * @param turns Nombre de tours demandé.
 * @throws {ForbiddenOperationError} si ce n'est pas un entier entre 1 et les tours libres.
 */
function requireTurns(tontine: Tontine, turns: number): void {
  const free = freeTurns(tontine);
  if (!Number.isInteger(turns) || turns < 1 || turns > free) {
    throw new ForbiddenOperationError(`Choisissez entre 1 et ${free} tours.`);
  }
}

/**
 * Accepte une invitation reçue : le membre connecté rejoint la tontine avec le
 * nombre de tours choisi, et elle s'ajoute en tête de ses tontines.
 * @param context Accès au store.
 * @param invitationId Invitation acceptée.
 * @param turns Nombre de tours pris.
 * @throws {UnknownEntityError} si l'invitation n'existe plus.
 * @throws {ForbiddenOperationError} si le nombre de tours dépasse les tours libres.
 */
export function acceptInvitation(
  context: PortfolioContext,
  invitationId: string,
  turns: number,
): void {
  const { tontine } = requireInvitation(context.get().invitations, invitationId);
  requireTurns(tontine, turns);
  const joined = { ...tontine, members: [...tontine.members, buildJoiningSelf(turns)] };
  context.set((state) => ({
    tontines: prependTontine(state.tontines, joined),
    invitations: state.invitations.filter((entry) => entry.id !== invitationId),
  }));
}

/**
 * Refuse une invitation reçue : elle disparaît sans rien rejoindre.
 * @param context Accès au store.
 * @param invitationId Invitation refusée.
 */
export function declineInvitation(context: PortfolioContext, invitationId: string): void {
  context.set((state) => ({
    invitations: state.invitations.filter((entry) => entry.id !== invitationId),
  }));
}
