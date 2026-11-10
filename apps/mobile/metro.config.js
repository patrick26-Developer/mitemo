// eslint-disable-next-line @typescript-eslint/no-require-imports -- Metro charge sa configuration en CommonJS.
const { getDefaultConfig } = require("expo/metro-config");
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Metro charge sa configuration en CommonJS.
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

/**
 * Configuration Metro de l'application : Uniwind traite `global.css` et génère
 * les types des classes Tailwind utilisées.
 */
module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./src/uniwind-types.d.ts",
});
