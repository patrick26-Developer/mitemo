/**
 * Configuration Babel de l'application mobile : preset Expo et plugin Reanimated,
 * qui doit rester le dernier de la liste.
 * @param {import("@babel/core").ConfigAPI} api API de Babel.
 * @returns {import("@babel/core").TransformOptions} Options de transformation.
 */
module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
