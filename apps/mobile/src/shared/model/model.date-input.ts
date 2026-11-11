/** Date ISO 8601 UTC, réduite au jour. */
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Lit une date saisie au format AAAA-MM-JJ et refuse les jours inexistants.
 * @param text Texte saisi.
 * @returns La date au format ISO 8601 UTC, ou `null` si elle est invalide.
 */
export function parseIsoDateInput(text: string): string | null {
  const trimmed = text.trim();
  if (!ISO_DAY.test(trimmed)) return null;

  const date = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10) === trimmed ? trimmed : null;
}
