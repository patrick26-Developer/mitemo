/**
 * Annonce l'avancement de la carte complète : combien de pointages sont déjà
 * faits sur le total prévu.
 * @param done Pointages faits.
 * @param total Pointages prévus.
 * @returns Par exemple « 5 sur 10 déjà pointés ».
 */
export function pointedCount(done: number, total: number): string {
  return `${done} sur ${total} déjà ${done > 1 ? "pointés" : "pointé"}`;
}
