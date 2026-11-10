/**
 * Assemble un prénom et un nom en un nom complet affichable.
 * @param firstName Prénom saisi.
 * @param lastName Nom saisi.
 * @returns Le nom complet, sans espaces superflus.
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}
