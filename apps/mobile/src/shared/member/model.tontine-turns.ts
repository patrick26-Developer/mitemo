import type { Tontine, TontineMember } from "./model.portfolio";
import { SELF_MEMBER_ID } from "./model.portfolio";

/**
 * Additionne les tours pris par les membres inscrits : un tour est une part,
 * cotisée à chaque tour et touchée une fois.
 * @param tontine Tontine concernée.
 * @returns Le nombre de tours déjà attribués.
 */
export function takenTurns(tontine: Tontine): number {
  return tontine.members.reduce((total, member) => total + member.turns, 0);
}

/**
 * Indique si la tontine accepte encore de nouveaux membres : seulement avant
 * son lancement, et tant que des tours restent libres. Une tontine lancée ne
 * se partage plus.
 * @param tontine Tontine concernée.
 * @returns `true` quand on peut partager l'invitation ou inviter un contact.
 */
export function canInviteMembers(tontine: Tontine): boolean {
  return tontine.state === "PENDING" && freeTurns(tontine) > 0;
}

/**
 * Compte les tours encore libres, que de nouveaux membres peuvent prendre.
 * @param tontine Tontine concernée.
 * @returns Le nombre de tours libres, jamais négatif.
 */
export function freeTurns(tontine: Tontine): number {
  return Math.max(tontine.totalRounds - takenTurns(tontine), 0);
}

/**
 * Déroule l'ordre de passage : chaque membre occupe autant de rangs que de
 * tours pris, à la suite, dans l'ordre fixé par l'administrateur.
 * @param tontine Tontine concernée.
 * @returns L'identifiant du bénéficiaire de chaque tour, du premier au dernier.
 */
export function turnOrder(tontine: Tontine): readonly string[] {
  return tontine.members.flatMap((member) => Array.from({ length: member.turns }, () => member.id));
}

/**
 * Calcule ce qu'un membre verse à chaque tour : une cotisation par tour pris.
 * @param tontine Tontine concernée.
 * @param member Membre qui cotise.
 * @returns Le montant dû, en plus petite unité de la devise.
 */
export function memberDue(tontine: Tontine, member: TontineMember): bigint {
  return tontine.contribution * BigInt(member.turns);
}

/**
 * Calcule ce que le membre connecté verse à chaque tour, une cotisation par
 * tour pris ; une seule cotisation tant qu'il n'a pas rejoint la tontine.
 * @param tontine Tontine concernée.
 * @returns Le montant dû, en plus petite unité de la devise.
 */
export function selfDue(tontine: Tontine): bigint {
  const self = tontine.members.find((member) => member.id === SELF_MEMBER_ID);
  return self === undefined ? tontine.contribution : memberDue(tontine, self);
}
