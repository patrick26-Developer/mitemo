import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";

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
