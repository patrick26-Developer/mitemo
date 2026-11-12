import type { Tontine, TontineMember } from "./model.portfolio";
import { SELF_MEMBER_ID } from "./model.portfolio";

/** État de paiement d'un membre : tour en cours et tours payés d'avance. */
export type MemberPayment = Pick<TontineMember, "paidCurrentRound" | "prepaidRounds">;

/**
 * Retrouve le membre connecté dans la tontine.
 * @param tontine Tontine concernée.
 * @returns Le membre connecté, ou `undefined` s'il ne participe pas.
 */
function selfOf(tontine: Tontine): TontineMember | undefined {
  return tontine.members.find((member) => member.id === SELF_MEMBER_ID);
}

/**
 * Compte les tours que le membre connecté a déjà payés d'avance.
 * @param tontine Tontine concernée.
 * @returns Le nombre de tours à venir déjà réglés.
 */
export function prepaidRounds(tontine: Tontine): number {
  return selfOf(tontine)?.prepaidRounds ?? 0;
}

/**
 * Indique si le membre connecté peut cotiser le tour suivant d'avance : le
 * tour en cours est réglé et il reste un tour à venir qui ne l'est pas.
 * @param tontine Tontine concernée.
 * @returns `true` quand une cotisation d'avance est possible.
 */
export function canPayAhead(tontine: Tontine): boolean {
  const self = selfOf(tontine);
  if (tontine.state !== "ACTIVE" || self === undefined || !self.paidCurrentRound) return false;

  return prepaidRounds(tontine) < tontine.totalRounds - tontine.round;
}

/**
 * Calcule le total que le membre connecté verse sur tout le cycle :
 * cotisation × tours pris × nombre de tours.
 * @param tontine Tontine concernée.
 * @returns Le total à verser, en plus petite unité de la devise.
 */
export function selfTotalDue(tontine: Tontine): bigint {
  const turns = BigInt(selfOf(tontine)?.turns ?? 1);
  return tontine.contribution * turns * BigInt(tontine.totalRounds);
}

/**
 * Calcule ce que le membre connecté a déjà versé : tours passés, tour en
 * cours s'il est réglé, puis tours payés d'avance.
 * @param tontine Tontine concernée.
 * @returns Le montant versé, en plus petite unité de la devise.
 */
export function selfPaidTotal(tontine: Tontine): bigint {
  const self = selfOf(tontine);
  if (self === undefined) return 0n;
  const rounds = tontine.round - 1 + (self.paidCurrentRound ? 1 : 0) + prepaidRounds(tontine);

  return tontine.contribution * BigInt(self.turns) * BigInt(rounds);
}

/**
 * Ajoute un tour payé d'avance au membre connecté.
 * @param tontines Tontines du membre.
 * @param id Tontine concernée.
 * @returns La liste avec le tour d'avance compté.
 */
export function markSelfPaidAhead(tontines: readonly Tontine[], id: string): readonly Tontine[] {
  return tontines.map((tontine) => {
    if (tontine.id !== id) return tontine;
    const members = tontine.members.map((member) =>
      member.id === SELF_MEMBER_ID
        ? { ...member, prepaidRounds: (member.prepaidRounds ?? 0) + 1 }
        : member,
    );
    return { ...tontine, members };
  });
}

/**
 * Calcule le paiement d'un membre au passage du tour : un tour payé d'avance
 * règle d'office le nouveau tour, sinon la cotisation redevient à régler.
 * @param member Paiement du membre au tour qui se termine.
 * @returns Son paiement au nouveau tour.
 */
export function nextRoundPayment(member: MemberPayment): Required<MemberPayment> {
  const ahead = member.prepaidRounds ?? 0;
  return { paidCurrentRound: ahead > 0, prepaidRounds: Math.max(ahead - 1, 0) };
}

/**
 * Désigne le tour que réglera la prochaine cotisation : le tour en cours, ou
 * le premier tour à venir qui n'est pas encore payé d'avance.
 * @param tontine Tontine concernée.
 * @returns Le numéro du tour réglé, à partir de 1.
 */
export function payingRound(tontine: Tontine): number {
  return canPayAhead(tontine) ? tontine.round + prepaidRounds(tontine) + 1 : tontine.round;
}
