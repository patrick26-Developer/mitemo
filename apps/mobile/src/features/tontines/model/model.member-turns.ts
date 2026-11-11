import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";

/** Membre et son rang de passage dans la tontine. */
export interface MemberTurn {
  readonly member: TontineMember;
  /** Rang de passage, à partir de 1 : le tour où il reçoit la restourne. */
  readonly turn: number;
}

/**
 * Range les membres pour la liste du détail : chacun garde son rang de
 * passage, et pendant le cycle le membre dont c'est le tour passe en tête,
 * suivi des prochains bénéficiaires dans l'ordre.
 * @param tontine Tontine affichée.
 * @returns Les membres et leur rang, dans l'ordre d'affichage.
 */
export function memberTurns(tontine: Tontine): readonly MemberTurn[] {
  const turns = tontine.members.map((member, index) => ({ member, turn: index + 1 }));
  if (tontine.state !== "ACTIVE") return turns;

  const start = turns.findIndex(({ member }) => member.id === tontine.beneficiaryId);
  return start <= 0 ? turns : [...turns.slice(start), ...turns.slice(0, start)];
}
