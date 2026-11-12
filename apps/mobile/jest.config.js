/**
 * Tests unitaires du mobile : preset officiel d'Expo, rendu avec Testing Library.
 * Plusieurs paquets sont remplacés : `lucide-react-native`, qui n'expose que du module
 * ES sous la condition `react-native`, `react-native-reanimated`, dont les
 * implémentations native et web ne fonctionnent pas sous Jest, `expo-crypto`,
 * dont le module natif est absent hors de l'appareil, `expo-linking`, qui
 * a besoin du manifeste Expo pour connaître le schéma, et `expo-contacts`, dont
 * le module natif du répertoire est absent hors de l'appareil, et
 * `react-native-keyboard-controller`, par le mock officiel du paquet.
 * @type {import("jest").Config}
 */
/** Le stockage Web expérimental de Node n'existe pas dans l'environnement natif simulé. */
Reflect.deleteProperty(globalThis, "localStorage");

/** Les workers Jest héritent eux aussi de l'environnement natif, sans stockage Web Node. */
process.env.NODE_OPTIONS = (
  (process.env.NODE_OPTIONS || "") + " --no-experimental-webstorage"
).trim();

module.exports = {
  preset: "jest-expo",
  /** Le premier rendu natif à froid peut dépasser cinq secondes sur Windows. */
  testTimeout: 15_000,
  testMatch: ["<rootDir>/src/**/*.spec.{ts,tsx}"],
  moduleNameMapper: {
    "^lucide-react-native$":
      "<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
    "^react-native-reanimated$": "<rootDir>/jest/mocks/react-native-reanimated.js",
    "^expo-crypto$": "<rootDir>/jest/mocks/expo-crypto.js",
    "^expo-linking$": "<rootDir>/jest/mocks/expo-linking.js",
    "^expo-contacts$": "<rootDir>/jest/mocks/expo-contacts.js",
    "^react-native-keyboard-controller$":
      "<rootDir>/node_modules/react-native-keyboard-controller/jest/index.js",
    "^@react-native-community/datetimepicker$": "<rootDir>/jest/mocks/datetime-picker.js",
    "^@react-native-async-storage/async-storage$":
      "<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.spec.{ts,tsx}", "!src/**/testing/**"],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
  },
};
