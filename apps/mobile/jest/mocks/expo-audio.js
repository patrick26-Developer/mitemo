/**
 * Double de test d'expo-audio : le module natif n'existe pas dans Jest. Le
 * lecteur ne joue rien ; un test qui vérifie la lecture remplace ce module
 * par son propre `jest.mock("expo-audio", ...)`.
 */

/**
 * Crée un lecteur muet.
 * @param {unknown} source Son à lire.
 * @returns {{ source: unknown, volume: number, play: () => void, seekTo: () => Promise<void> }} Le lecteur.
 */
export function createAudioPlayer(source) {
  return { source, volume: 1, play: () => undefined, seekTo: async () => undefined };
}
