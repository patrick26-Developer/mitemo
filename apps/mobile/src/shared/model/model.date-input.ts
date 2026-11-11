/** Date française réduite au jour : JJ/MM/AAAA, avec ou sans zéro initial. */
const FRENCH_DAY = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

/**
 * Lit une date saisie au format JJ/MM/AAAA et refuse les jours inexistants.
 * @param text Texte saisi, par exemple « 31/12/2026 » ou « 5/1/2026 ».
 * @returns La date au format ISO 8601 UTC, ou `null` si elle est invalide.
 */
export function parseFrenchDateInput(text: string): string | null {
  const match = FRENCH_DAY.exec(text.trim());
  if (match === null) return null;

  const [, day = "", month = "", year = ""] = match;
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const date = new Date(`${iso}T00:00:00.000Z`);

  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso ? null : iso;
}
