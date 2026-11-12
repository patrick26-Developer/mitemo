/**
 * Double de test d'`expo-contacts` : le module natif du répertoire n'existe
 * pas hors de l'appareil. Par défaut, l'accès est refusé et le répertoire vide ;
 * un test qui a besoin de contacts remplace ces fonctions par `jest.mock`.
 */

/** Champs lisibles d'un contact. */
export const ContactField = { FULL_NAME: "fullName", PHONES: "phones" };

/**
 * Demande l'accès au répertoire.
 * @returns {Promise<{ granted: boolean }>} Un accès refusé.
 */
export async function requestPermissionsAsync() {
  return Promise.resolve({ granted: false });
}

/** Répertoire du téléphone, vide. */
export const Contact = {
  /**
   * Lit des champs de tous les contacts.
   * @returns {Promise<never[]>} Aucun contact.
   */
  async getAllDetails() {
    return Promise.resolve([]);
  },
};
