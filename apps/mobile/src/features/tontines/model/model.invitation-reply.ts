import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import { freeTurns } from "../../../shared/member/model.tontine-turns";

/** Ligne du résumé d'une tontine proposée. */
export interface InvitationFact {
  readonly label: string;
  readonly value: string;
}

/**
 * Résume la tontine proposée, pour décider d'accepter ou de refuser :
 * cotisation d'un tour, rythme et tours encore libres.
 * @param tontine Tontine proposée.
 * @returns Les lignes du résumé, dans l'ordre d'affichage.
 */
export function invitationFacts(tontine: Tontine): readonly InvitationFact[] {
  return [
    { label: "Cotisation par tour", value: `${formatAmount(tontine.contribution)} FCFA` },
    { label: "Fréquence", value: formatFrequency(tontine.frequency) },
    { label: "Tours libres", value: `${freeTurns(tontine)} sur ${tontine.totalRounds}` },
  ];
}

/**
 * Explique ce qu'engage le nombre de tours choisi : une cotisation par tour
 * pris, versée à chaque tour, et autant de restournes reçues.
 * @param tontine Tontine proposée.
 * @param turns Nombre de tours choisi.
 * @returns La phrase affichée sous le compteur.
 */
export function turnsChoiceHint(tontine: Tontine, turns: number): string {
  const due = formatAmount(tontine.contribution * BigInt(turns));
  return `Vous cotiserez ${due} FCFA à chaque tour et toucherez la restourne ${turns} fois.`;
}
