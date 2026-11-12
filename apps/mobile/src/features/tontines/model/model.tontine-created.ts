import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { formatFrequency, tontinePot } from "../../../shared/member/model.portfolio";

/**
 * Invite à compléter la tontine, accordé au nombre de membres manquants.
 * @param missing Membres encore à inviter.
 * @returns La phrase d'invitation.
 */
function inviteSentence(missing: number): string {
  return missing === 1 ? "Invitez l'autre membre." : `Invitez les ${missing} autres membres.`;
}

/**
 * Résume une tontine qui vient d'être créée : participants prévus, rythme,
 * membres restant à inviter et cagnotte promise par le récapitulatif.
 * @param tontine Tontine créée, encore en préparation.
 * @returns Le résumé affiché sous « Votre tontine est prête ».
 */
export function tontineCreatedSummary(tontine: Tontine): string {
  const missing = Math.max(tontine.totalRounds - tontine.members.length, 0);
  const pot = formatAmount(tontinePot(tontine));

  return `« ${tontine.name} » est prévue pour ${tontine.totalRounds} participants, ${formatFrequency(tontine.frequency)}. ${inviteSentence(missing)} Cagnotte de ${pot} FCFA par tour.`;
}

/**
 * Rédige le message partagé pour inviter des membres : le nom de la tontine,
 * la cotisation, le rythme et le code à saisir dans Mitemo.
 * @param tontine Tontine à rejoindre.
 * @param code Code d'invitation.
 * @returns Le message prêt à partager.
 */
export function invitationMessage(tontine: Tontine, code: string): string {
  const contribution = `${formatAmount(tontine.contribution)} FCFA ${formatFrequency(tontine.frequency)}`;
  return `Rejoignez ma tontine « ${tontine.name} » sur Mitemo : ${contribution}. Code d'invitation : ${code}`;
}
