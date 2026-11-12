import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";

/** Membre et un de ses rangs de passage dans la tontine. */
export interface MemberTurn {
  readonly member: TontineMember;
  /** Rang de passage, à partir de 1 : le tour où il reçoit la restourne. */
  readonly turn: number;
}

/**
 * Numérote les rangs de passage, de 1 au dernier tour pris. Un membre qui a
 * pris plusieurs tours revient à chacun d'eux, à la suite. La liste garde
 * toujours cet ordre : le rang du tour en cours reste à sa place, mis en
 * avant par la ligne elle-même.
 * @param tontine Tontine affichée.
 * @returns Chaque rang et son membre, dans l'ordre de passage.
 */
export function memberTurns(tontine: Tontine): readonly MemberTurn[] {
  const order = tontine.members.flatMap((member) =>
    Array.from({ length: member.turns }, () => member),
  );
  return order.map((member, index) => ({ member, turn: index + 1 }));
}

/**
 * Choisit les rangs montrés dans le détail, sans dérouler toute la liste :
 * les premiers avant le départ, puis une fenêtre qui commence au rang
 * précédant le tour en cours, toujours pleine en fin de cycle.
 * @param tontine Tontine affichée.
 * @param size Nombre de rangs montrés.
 * @returns Les rangs de l'aperçu, dans l'ordre de passage.
 */
export function previewTurns(tontine: Tontine, size: number): readonly MemberTurn[] {
  const turns = memberTurns(tontine);
  const anchor = tontine.state === "PENDING" ? 0 : tontine.round - 2;
  const start = Math.max(Math.min(anchor, turns.length - size), 0);
  return turns.slice(start, start + size);
}

/**
 * Énumère en toutes lettres les rangs de passage d'un membre.
 * @param tontine Tontine affichée.
 * @param memberId Membre concerné.
 * @returns Par exemple « Tour 5 » ou « Tours 2, 3 et 4 ».
 */
export function turnsLabel(tontine: Tontine, memberId: string): string {
  const turns = memberTurns(tontine)
    .filter(({ member }) => member.id === memberId)
    .map(({ turn }) => String(turn));
  if (turns.length <= 1) return `Tour ${turns.join("")}`;
  return `Tours ${turns.slice(0, -1).join(", ")} et ${turns.at(-1) ?? ""}`;
}
