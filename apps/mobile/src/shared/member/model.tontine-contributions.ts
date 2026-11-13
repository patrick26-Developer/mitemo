import type { Tontine } from "./model.portfolio";

/**
 * Indique si la tontine a déjà reçu un versement, du tour en cours ou d'avance.
 * @param tontine Tontine concernée.
 * @returns `true` dès qu'un membre a cotisé.
 */
export function tontineHasContributions(tontine: Tontine): boolean {
  return tontine.members.some(
    (member) => member.paidCurrentRound || (member.prepaidRounds ?? 0) > 0,
  );
}

/**
 * Indique si les règles (cotisation, fréquence) sont figées : dès le
 * lancement ou dès le premier versement, les membres s'étant engagés sur elles.
 * @param tontine Tontine concernée.
 * @returns `true` quand seuls le nom et la couleur se modifient.
 */
export function tontineRulesLocked(tontine: Tontine): boolean {
  return tontine.state !== "PENDING" || tontineHasContributions(tontine);
}
