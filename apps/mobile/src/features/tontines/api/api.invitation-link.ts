import { createURL } from "expo-linking";

/**
 * Construit le lien qui ouvre l'invitation dans l'application, avec le
 * schéma de l'app (ou celui d'Expo Go pendant le développement).
 * @param code Code d'invitation de la tontine.
 * @returns Le lien à partager.
 */
export function invitationLink(code: string): string {
  return createURL(`invitation/${code}`);
}
