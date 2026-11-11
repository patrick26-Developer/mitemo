/**
 * Tests unitaires du mobile : preset officiel d'Expo, rendu avec Testing Library.
 * Trois paquets sont remplacés : `lucide-react-native`, qui n'expose que du module
 * ES sous la condition `react-native`, `react-native-reanimated`, dont les
 * implémentations native et web ne fonctionnent pas sous Jest, et `expo-crypto`,
 * dont le module natif est absent hors de l'appareil.
 * @type {import("jest").Config}
 */
module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/src/**/*.spec.{ts,tsx}"],
  moduleNameMapper: {
    "^lucide-react-native$":
      "<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
    "^react-native-reanimated$": "<rootDir>/jest/mocks/react-native-reanimated.js",
    "^expo-crypto$": "<rootDir>/jest/mocks/expo-crypto.js",
    "^@react-native-community/datetimepicker$": "<rootDir>/jest/mocks/datetime-picker.js",
    "^@react-native-async-storage/async-storage$":
      "<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.spec.{ts,tsx}", "!src/**/testing/**"],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
  },
};
