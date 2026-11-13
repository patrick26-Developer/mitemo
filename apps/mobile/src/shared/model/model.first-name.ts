/**
 * Prénom du membre, pour s'adresser à lui avec chaleur.
 * @param name Nom complet saisi par le membre.
 * @returns Le premier mot du nom, ou une chaîne vide sans nom.
 */
export function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}
