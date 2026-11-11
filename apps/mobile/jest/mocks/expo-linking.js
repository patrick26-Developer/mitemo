/**
 * Double de test d'`expo-linking` : sans manifeste Expo, `createURL` ne sait
 * pas quel schéma utiliser. Le schéma de l'application (`app.json`) est repris.
 */

/**
 * Construit un lien vers un écran de l'application.
 * @param {string} path Chemin de l'écran.
 * @returns {string} Le lien avec le schéma `mitemo`.
 */
export function createURL(path) {
  return `mitemo://${path}`;
}
