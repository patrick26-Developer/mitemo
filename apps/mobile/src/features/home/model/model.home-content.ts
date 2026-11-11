/**
 * Formate un compteur de section, au singulier ou au pluriel.
 * @param count Nombre d'éléments affichés.
 * @param singular Libellé au singulier.
 * @param plural Libellé au pluriel.
 * @returns Le libellé compté, par exemple « 2 Tontines ».
 */
export function formatCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
