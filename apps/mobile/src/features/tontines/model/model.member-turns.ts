import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";

/** Membre et son rang de passage dans la tontine. */
export interface MemberTurn {
  readonly member: TontineMember;
  /** Rang de passage, à partir de 1 : le tour où il reçoit la restourne. */
  readonly turn: number;
}

/**
 * Numérote les membres par leur rang de passage, de 1 au nombre de membres.
 * La liste garde toujours cet ordre : le bénéficiaire du tour reste à sa
 * place, mis en avant par la ligne elle-même.
 * @param tontine Tontine affichée.
 * @returns Les membres et leur rang, dans l'ordre de passage.
 */
export function memberTurns(tontine: Tontine): readonly MemberTurn[] {
  return tontine.members.map((member, index) => ({ member, turn: index + 1 }));
}
