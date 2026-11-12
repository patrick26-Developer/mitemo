import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import { isTontineAdmin, SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { accentColors } from "../../../shared/model/model.accent-color";

/** Texte d'une confirmation de retrait. */
export interface RemovalContent {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly tone: "danger";
}

/**
 * Indique si l'administrateur peut retirer ce membre : jamais lui-même, et
 * seulement avant le départ de la tontine.
 * @param item Tontine affichée.
 * @param member Membre de la ligne.
 * @returns `true` quand le retrait est permis.
 */
export function canRemove(item: Tontine, member: TontineMember): boolean {
  return isTontineAdmin(item) && member.id !== SELF_MEMBER_ID && item.state === "PENDING";
}

/**
 * Indique si l'administrateur peut annuler une invitation : seulement avant
 * le départ, tant que le contact n'a pas répondu.
 * @param item Tontine affichée.
 * @returns `true` quand l'annulation est permise.
 */
export function canCancelInvitation(item: Tontine): boolean {
  return isTontineAdmin(item) && item.state === "PENDING";
}

/**
 * Couleur du rang du tour en cours, celle de la tontine ; un membre qui a
 * plusieurs tours n'est mis en avant qu'au rang du tour en cours.
 * @param item Tontine affichée.
 * @param turn Rang de la ligne.
 * @returns La couleur, ou `undefined` pour les autres rangs.
 */
export function currentTurnAccent(item: Tontine, turn: number): string | undefined {
  const current = item.state === "ACTIVE" && turn === item.round;
  return current ? accentColors(item.headerColors[0]).background : undefined;
}

/**
 * Texte de la confirmation de retrait d'un membre.
 * @param item Tontine affichée.
 * @param member Membre à retirer, `null` quand la feuille est fermée.
 * @returns Le titre, le message et l'action de la confirmation.
 */
export function removalContent(item: Tontine, member: TontineMember | null): RemovalContent {
  const name = member?.name ?? "ce membre";
  return {
    title: `Retirer ${name} ?`,
    message: `${name} ne fera plus partie de « ${item.name} ». Vous pourrez l'inviter de nouveau.`,
    confirmLabel: "Retirer de la tontine",
    tone: "danger",
  };
}
